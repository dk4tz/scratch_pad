// "Our Statcast system processes real-time data from multiple
// ballparks simultaneously, each generating around 10,000 events
// per second. Design a scalable system to ingest, process, and
// distribute this data to multiple consuming applications with
// minimal latency."

// Event type
type StatcastEvent = {
	gameId: string;
	ballparkId: string;
	timestamp: number;
	eventType: string;
	data: Record<string, any>;
};

type ProcessedEvent = StatcastEvent & {
	processedAt: number;
};

class StatcastProcessor {
	// queue for each game (ballparkId:gameId)
	#queues = new Map<string, StatcastEvent[]>();

	// callbacks for consumers
	#subscribers = new Set<(event: ProcessedEvent) => void>();

	// parallel processing
	readonly #workers: number;
	#processing: boolean = false;

	constructor(workers = 4) {
		this.#workers = workers;
	}

	async ingest(event: StatcastEvent): Promise<void> {
		const key = `${event.ballparkId}:${event.gameId}`;

		if (!this.#queues.has(key)) {
			this.#queues.set(key, []);
		}

		this.#queues.get(key).push(event);
		this.#startProcessing();
	}

	subscribe(callback: (event: ProcessedEvent) => void): () => void {
		this.#subscribers.add(callback);
		return () => this.#subscribers.delete(callback);
	}

	async #startProcessing(): Promise<void> {
		if (this.#processing) return;
		this.#processing = true;

		try {
			while (this.#queues.size > 0) {
				const partitions = Array.from(this.#queues.keys()).slice(
					0,
					this.#workers
				);

				await Promise.all(
					partitions.map((key) => this.#processPartition(key))
				);
			}
		} catch (error) {
			console.log('Processing error:', error);
		} finally {
			this.#processing = false;
		}
	}

	async #processPartition(key: string): Promise<void> {
		let events = this.#queues.get(key);
		let event = events.shift();

		if (!event) {
			this.#queues.delete(key);
			return;
		}

		try {
			let processed: ProcessedEvent = {
				...event,
				processedAt: Date.now()
			};
			this.#subscribers.forEach((sub) => sub(processed));
		} catch (error) {
			console.error(`Event processing failed for ${key}:`, error);
		}

		if (events.length === 0) {
			this.#queues.delete(key);
		}
	}
}
const processor = new StatcastProcessor();

const unsubscribe = processor.subscribe((event) => {
	console.log(`Processed ${event.eventType} from ${event.ballparkId}`);
});

processor.ingest({
	gameId: 'NYY-BOS-2025-01',
	ballparkId: 'yankee_stadium',
	timestamp: Date.now(),
	eventType: 'pitch',
	data: { velocity: 95.2, spinRate: 2400 }
});
