// "Our Statcast system processes real-time data from multiple
// ballparks simultaneously, each generating around 10,000 events
// per second. Design a scalable system to ingest, process, and
// distribute this data to multiple consuming applications with
// minimal latency."

type RawStatcastEvent = {
	ballparkId: string;
	gameId: string;
	timestamp: number;
	data: any;
};

type ProcessedStatcastEvent = RawStatcastEvent & {
	processedAt: number;
};

export class GameStream {
	#ws: WebSocket;

	private constructor() {}

	static async connect(ws_url: string): Promise<GameStream> {
		let stream = new GameStream();
		try {
			await new Promise<void>((res, rej) => {
				let ws = new WebSocket(ws_url);
				stream.#ws = ws;
				ws.onopen = () => res();
				ws.onerror = (err) => rej(err);
			});
		} catch (err) {
			stream.#ws?.close();
			throw err;
		}
		return stream;
	}

	close() {
		this.#ws.close();
	}

	async *[Symbol.asyncIterator](): AsyncIterator<RawStatcastEvent> {
		try {
			while (this.#ws.readyState === WebSocket.OPEN) {
				yield await new Promise<RawStatcastEvent>((res, rej) => {
					this.#ws.onmessage = (msg) => res(JSON.parse(msg.data));
					this.#ws.onerror = (err) => rej(err);
				});
			}
		} catch (err) {
			throw err;
		}
	}
}

export class StatCProcessor {
	#queues = new Map<string, RawStatcastEvent[]>();
	#subscribers = new Set<(event: ProcessedStatcastEvent) => Promise<void>>();

	async ingest(stream: GameStream) {
		try {
			for await (const event of stream) {
				let key = `${event.ballparkId}:${event.gameId}`;
				let queue = this.#queues.get(key);
				if (!queue) {
					this.#queues.set(key, [event]);
					this.#process(key);
				} else {
					queue.push(event);
				}
			}
		} catch (err) {
			throw err;
		}
	}

	async #process(key: string) {
		try {
			while (this.#queues.get(key).length > 0) {
				let event = this.#queues.get(key).shift();
				let processed: ProcessedStatcastEvent = {
					...event,
					processedAt: Date.now()
				};
				// other things
				const results = await Promise.allSettled(
					[...this.#subscribers].map((sub) => sub(processed))
				);

				results.forEach((result) => {
					if (result.status === 'rejected') {
						console.log('ERROR: ', result);
					}
				});
			}
		} catch (err) {
			throw err;
		} finally {
			this.#queues.delete(key);
		}
	}

	subscribe(
		subscriber: (event: ProcessedStatcastEvent) => Promise<void>
	): () => void {
		this.#subscribers.add(subscriber);
		return () => this.#subscribers.delete(subscriber);
	}
}
