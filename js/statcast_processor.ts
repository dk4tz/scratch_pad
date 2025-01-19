// "Our Statcast system processes real-time data from multiple
// ballparks simultaneously, each generating around 10,000 events
// per second. Design a scalable system to ingest, process, and
// distribute this data to multiple consuming applications with
// minimal latency."

type StatEvent = {
	eventId: number;
	gameId: string;
	ballparkId: string;
	timestamp: number;
	eventType: 'hit' | 'pitch' | 'error';
	data: Record<string, any>;
};

type ProcessedStatEvent = StatEvent & {
	processedAt: number;
};

class EventQueue {
	static readonly NUM_WORKERS: number = 4;
	static readonly NUM_RETRIES: number = 3;

	#queues = new Map<string, StatEvent[]>();
	#eventHandler: (event: ProcessedStatEvent) => void;
	#isProcessing = false;

	constructor() {}

	setEventHandler(handler: (event: ProcessedStatEvent) => void) {
		if (!handler) {
			throw new Error('You need to put in a handler!!!');
		}
		this.#eventHandler = handler;
	}

	enqueue(event: StatEvent) {
		// validate event

		// create the queue key
		let queue_key = `${event.ballparkId}:${event.gameId}`;
		// if the queue doesn't have a key
		if (!this.#queues.has(queue_key)) {
			this.#queues.set(queue_key, []);
		}

		this.#queues.get(queue_key).push(event);

		if (!this.#isProcessing) {
			this.#isProcessing = true;
			try {
				this.#processParallel().finally(() => {
					this.#isProcessing = false;
				});
			} catch (error) {
				throw new Error('error processing queue');
			}
		}
	}

	async #processParallel() {
		while (this.#queues.size > 0) {
			let queues_to_process = Array.from(this.#queues.keys()).slice(
				0,
				EventQueue.NUM_WORKERS
			);

			await Promise.allSettled(
				queues_to_process.map(async (key) => {
					try {
						await this.#processQueue(key);
					} catch (error) {
						console.error(`Error on queue ${key}: ${error}`);
						throw new Error();
					}
				})
			);
		}
	}

	async #processQueue(key: string) {
		// grab queue
		let queue = this.#queues.get(key);
		if (!queue) return;

		let event = queue.shift();
		if (!event) {
			this.#queues.delete(key);
			return;
		}
		let processed_event: ProcessedStatEvent = {
			...event,
			processedAt: Date.now()
		};

		try {
			this.#eventHandler(processed_event);
		} catch (error) {
			throw new Error(`ERROR: ${JSON.stringify(error)}`);
		}

		if (queue.length === 0) {
			this.#queues.delete(key);
		}
	}
}

class EventBus {
	// data
	#subscribers = new Set<(event: ProcessedStatEvent) => void>();

	//methods
	publish(event: ProcessedStatEvent): void {
		this.#subscribers.forEach((subscriber) => subscriber(event));
	}
	subscribe(subscriber: (event: ProcessedStatEvent) => void): () => void {
		this.#subscribers.add(subscriber);
		return () => this.#subscribers.delete(subscriber);
	}
	clearSubscribers() {
		this.#subscribers.clear();
	}
}

class StatcastService {
	#queue = new EventQueue();
	#eventBus = new EventBus();

	constructor() {
		this.#queue.setEventHandler((event) => this.#eventBus.publish(event));
	}

	ingest(event: StatEvent) {
		this.#queue.enqueue(event);
	}
	subscribe(subscriber: (event: ProcessedStatEvent) => void) {
		this.#eventBus.subscribe(subscriber);
	}
}
/////////

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function simulateBallpark(
	service: StatcastService,
	ballparkId: string,
	numEvents: number,
	delayMs: number = 0
) {
	for (let i = 0; i < numEvents; i++) {
		const event: StatEvent = {
			eventId: i,
			gameId: `game-${ballparkId}`,
			ballparkId,
			timestamp: Date.now(),
			eventType: i % 2 === 0 ? 'pitch' : 'hit',
			data: { sequence: i }
		};
		service.ingest(event);
		if (delayMs > 0) {
			await sleep(delayMs);
		}
	}
}

async function runTest() {
	const service = new StatcastService();

	// Track processed events for verification
	const processedEvents = new Map<string, ProcessedStatEvent[]>();

	// Subscribe to events
	service.subscribe((event) => {
		const key = `${event.ballparkId}:${event.gameId}`;
		if (!processedEvents.has(key)) {
			processedEvents.set(key, []);
		}
		processedEvents.get(key).push(event);
		console.log(
			`Processed event ${event.eventId} from ${event.ballparkId}`
		);
	});

	// Simulate multiple ballparks sending events
	const ballparks = ['yankee_stadium', 'fenway_park', 'wrigley_field'];
	const eventsPerBallpark = 100;

	console.log('Starting simulation...');
	const startTime = Date.now();

	await Promise.all(
		ballparks.map((ballparkId) =>
			simulateBallpark(service, ballparkId, eventsPerBallpark)
		)
	);

	// Give some time for processing to complete
	await sleep(1000);

	// Verify results
	console.log('\nVerification Results:');
	for (const [key, events] of processedEvents) {
		console.log(`\n${key}:`);
		console.log(`Total events processed: ${events.length}`);

		// Verify event ordering
		const isOrdered = events.every(
			(event, index) =>
				index === 0 || events[index - 1].eventId < event.eventId
		);
		console.log(`Events in order: ${isOrdered}`);

		// Check for missing events
		const processedIds = new Set(events.map((e) => e.eventId));
		const missing = [];
		for (let i = 0; i < eventsPerBallpark; i++) {
			if (!processedIds.has(i)) {
				missing.push(i);
			}
		}
		console.log(
			`Missing events: ${
				missing.length === 0 ? 'None' : missing.join(', ')
			}`
		);
	}

	const duration = Date.now() - startTime;
	console.log(`\nTotal duration: ${duration}ms`);
}

// Run the test
runTest().catch(console.error);
