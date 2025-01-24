type GamePitch = {
	timestamp: number;
	velocity: number;
	playerId: string;
	gameId: string;
};

// you have a ws endpoint that sends messages on each pitch
// 1. generate a service to ingest this data and keep a running pitch count for the pitcher
// 2. generate a service to notify subscribers after each pitch
// 3. handle concurrent games

class GamePitchStream {
	#ws: WebSocket;
	#reconnectAttempts: number = 0;
	readonly #maxReconnectAttempts: number = 5;

	private constructor() {}

	static async connect(ws_url: string): Promise<GamePitchStream> {
		let stream = new GamePitchStream();
		try {
			await new Promise<void>((res, rej) => {
				let ws = new WebSocket(ws_url);
				ws.onopen = () => res();
				ws.onerror = (err) => rej(err);
				stream.#ws = ws;
			});
			return stream;
		} catch (err) {
			stream.#reconnect();
			throw new Error(err);
		}
	}

	// close
	async close(): Promise<void> {
		if (this.#ws.readyState == WebSocket.CLOSED) {
			return;
		}
		try {
			await new Promise<void>((res, rej) => {
				this.#ws.close();
				this.#ws.onclose = () => res();
				this.#ws.onerror = (err) => rej();
			});
		} catch (err) {
			throw new Error(err);
		}
	}

	// reconnect?
	async #reconnect() {
		const delaySeconds = (attempt: number) => Math.pow(2, attempt) * 1000;
		while (true) {
			if (this.#reconnectAttempts >= this.#maxReconnectAttempts) {
				throw new Error('Exceeded max reconnect attempts');
			}
			this.#reconnectAttempts++;

			await new Promise<void>((res, _) =>
				setTimeout(() => res(), delaySeconds(this.#reconnectAttempts))
			);
			try {
				if (this.#ws?.readyState === WebSocket.OPEN) {
					this.#ws.close();
				}

				await new Promise<void>((res, rej) => {
					this.#ws = new WebSocket(this.#ws.url);
					this.#ws.onopen = () => {
						this.#reconnectAttempts = 0;
						res();
					};
					this.#ws.onerror = (err) => rej(err);
				});
				return;
			} catch (err) {
				console.error('failed on connect attempt:');
				console.error(this.#reconnectAttempts);
			}
		}
	}

	// iterator
	async *[Symbol.asyncIterator]() {
		while (true) {
			try {
				yield await new Promise<GamePitch>((res, rej) => {
					this.#ws.onmessage = (msg) => res(JSON.parse(msg.data));
					this.#ws.onerror = (err) => rej(err);
				});
			} catch (err) {
				await this.#reconnect();
			}
		}
	}
}

type PitchStats = {
	pitchCount: number;
	totalVelocity: number;
};

type PitchPlayer = {
	playerId: string;
};

class GamePitchProcessor {
	#pitchQueues = new Map<string, GamePitch[]>();
	#pitchStats = new Map<PlayerId, PitchStats>();
	#subscribers = new Set<(pitch: GamePitch) => Promise<void>>();
	#activeGames = new Set<string>();

	// constructor
	private constructor() {}

	// ingest(stream)
	async ingest(stream: GamePitchStream): Promise<void> {
		for await (const pitchEvent of stream) {
			// validate pitch
			// does it have a queue?
			const key = pitchEvent.gameId;
			if (!this.#pitchQueues.get(key)) {
				this.#pitchQueues.set(key, []);
			}
			this.#pitchQueues.get(key).push(pitchEvent);
			if (!this.#activeGames.has(key)) {
				this.#activeGames.add(key);
				this.#process(key);
			}
		}
	}

	async #process(key: string) {
		let queue = this.#pitchQueues.get(key);
		if (!queue) {
			this.#activeGames.delete(key);
			return;
		}
		if (!queue.length) {
			this.#pitchQueues.delete(key);
			this.#activeGames.delete(key);
			return;
		}
		const pitch = queue.shift();

		let playerId = pitch.playerId;
		if (!this.#pitchStats.has(playerId)) {
			this.#pitchStats.set(playerId, { pitchCount: 0, totalVelocity: 0 });
		}
		let newStats = { ...this.#pitchStats.get(playerId) };
		newStats.pitchCount++;
		newStats.totalVelocity += pitch.velocity;

		this.#pitchStats.set(playerId, newStats);

		const responses = await Promise.allSettled(
			[...this.#subscribers].map((sub) => {
				sub(pitch);
			})
		);
		responses.forEach((response, idx) => {
			if (response.status === 'rejected') {
				console.error(
					`Issue with subscriber ${idx}: ${response.reason}`
				);
			}
		});
	}

	subscribe(subscriber: (GamePitch) => Promise<void>): () => void {
		this.#subscribers.add(subscriber);
		return () => this.#subscribers.delete(subscriber);
	}

	// publish
}
