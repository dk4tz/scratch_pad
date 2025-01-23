type GameEvent = {
	id: number;
	gameId: string;
	type: 'HIT' | 'OUT' | 'WALK';
	playerId: string;
	timestamp: number;
};

class GameStream {
	#ws: WebSocket;

	private constructor() {}

	static async connect(ws_url: string): Promise<GameStream> {
		const stream = new GameStream();
		try {
			await new Promise<void>((res, rej) => {
				let ws = new WebSocket(ws_url);
				ws.onopen = () => res();
				ws.onerror = (err) => rej(err);
				stream.#ws = ws;
			});
			return stream;
		} catch (err) {
			stream.#ws?.close();
			throw new Error(err);
		}
	}

	async close(): Promise<void> {
		if (this.#ws.readyState === WebSocket.CLOSED) {
			return;
		}
		try {
			this.#ws.close();
			await new Promise<void>(
				(res, _) => (this.#ws.onclose = () => res())
			);
		} catch (err) {
			throw new Error(err);
		}
	}

	async *[Symbol.asyncIterator]() {
		while (this.#ws.readyState === WebSocket.OPEN) {
			try {
				yield await new Promise<GameEvent>((res, rej) => {
					this.#ws.onmessage = (msg) => res(JSON.parse(msg.data));
					this.#ws.onerror = (err) => rej(err);
				});
			} catch (err) {
				throw new Error(err);
			}
		}
	}
}

// process events from multiple games simultaneously
// send notifications to subscribers
// keep a memory tally of player stats

type PStats = {
	hits: number;
	walks: number;
	outs: number;
};
class GameProcessor {
	#queues = new Map<string, GameEvent[]>();
	#stats = new Map<string, PStats>();
	#inProgress = new Set<string>();
	#subscribers = new Set<(gameEvent: GameEvent) => Promise<void>>();

	async ingest(stream: GameStream): Promise<void> {
		for await (const event of stream) {
			const key = event.gameId;
			if (!this.#queues.has(key)) {
				this.#queues.set(key, []);
			}
			this.#queues.get(key)!.push(event);
			if (!this.#inProgress.has(key)) {
				this.#inProgress.add(key);
				this.#process(key).catch((err) => {
					console.error(`Processing error for game ${key}:`, err);
					this.#inProgress.delete(key);
				});
			}
		}
	}

	async #process(key: string) {
		try {
			while (this.#queues.get(key).length > 0) {
				let game_event = this.#queues.get(key).shift();
				let stats = this.#stats.get(game_event.playerId) ?? {
					hits: 0,
					walks: 0,
					outs: 0
				};
				const stat_key = (game_event.type.toLowerCase() +
					's') as keyof PStats;
				stats[stat_key]++;
				this.#stats.set(game_event.playerId, stats);

				const results = await Promise.allSettled(
					[...this.#subscribers].map((subsc) => subsc(game_event))
				);
				results.forEach((result, idx) => {
					if (result.status === 'rejected') {
						console.error(
							`Issue with subscriber #${idx}: ${result.reason}`
						);
					}
				});
			}
			this.#queues.delete(key);
		} finally {
			this.#inProgress.delete(key);
		}
	}

	subscribe(handler: (game_event: GameEvent) => Promise<void>): () => void {
		this.#subscribers.add(handler);
		return () => this.#subscribers.delete(handler);
	}
}
