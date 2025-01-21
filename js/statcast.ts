// "Our Statcast system processes real-time data from multiple
// ballparks simultaneously, each generating around 10,000 events
// per second. Design a scalable system to ingest, process, and
// distribute this data to multiple consuming applications with
// minimal latency."

type BaseballEvent = {
	ballparkId: string;
	gameId: string;
	data: any;
};

class BallparkStream implements AsyncIterable<BaseballEvent> {
	#ws: WebSocket;
	private constructor() {}

	static async connect(url: string): Promise<BallparkStream> {
		const stream = new BallparkStream();

		try {
			await new Promise((res, rej) => {
				let ws = new WebSocket(url);
				stream.#ws = ws;
				stream.#ws.onopen = res;
				stream.#ws.onerror = rej;
			});
		} catch (err) {
			stream.#ws?.close();
			throw err;
		}

		return stream;
	}

	async *[Symbol.asyncIterator](): AsyncIterator<BaseballEvent> {
		while (this.#ws.readyState === WebSocket.OPEN) {
			yield await new Promise<BaseballEvent>((res, rej) => {
				this.#ws.onmessage = (msg) => res(JSON.parse(msg.data));
				this.#ws.onerror = rej;
			});
		}
	}

	close(): void {
		this.#ws.close();
	}
}

class StatProcessor {
	#queues = new Map<string, BaseballEvent[]>();
	#subscribers = new Set<(event: BaseballEvent) => Promise<void>>();
	#maxQueueSize = 1000; // Configurable limit

	subscribe(subscriber: (event: BaseballEvent) => Promise<void>) {
		this.#subscribers.add(subscriber);
		return () => this.#subscribers.delete(subscriber);
	}

	async ingest(stream: BallparkStream) {
		try {
			for await (const event of stream) {
				const key = `${event.ballparkId}:${event.gameId}`;
				let queue = this.#queues.get(key) ?? [];

				while (queue.length >= this.#maxQueueSize) {
					await new Promise((resolve) => setTimeout(resolve, 100));
				}
				if (!this.#queues.has(key)) {
					this.#queues.set(key, [event]);
					this.#processQueue(key);
				} else {
					this.#queues.get(key).push(event);
				}
			}
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async #processQueue(key: string): Promise<void> {
		try {
			while (this.#queues.get(key)?.length > 0) {
				const queue = this.#queues.get(key);
				if (!queue) break;
				const next_event = queue.shift();
				// additional process logic
				await Promise.allSettled(
					[...this.#subscribers].map((sub) => {
						return sub(next_event);
					})
				);
			}
		} finally {
			this.#queues.delete(key);
		}
	}
}
