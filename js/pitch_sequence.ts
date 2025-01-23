type PitchEvent = {
	id: string;
	timestamp: number;
	velocity: number;
	pitchType: string; // 'FASTBALL', 'CURVEBALL', 'SLIDER', etc.
	coordinates: {
		x: number;
		y: number;
	};
};

type PitchCoordinates = {
	x: number;
	y: number;
};

type ProcessedPitch = {
	id: string;
	timestamp: number;
	avgVelocity: number;
	coordinates: PitchCoordinates[];
};

//"Design and implement a PitchSequence class that processes a stream of baseball pitch data.
// The class should:

// Accept real-time pitch data through a method called addPitch
// Maintain a sequence of the last 5 pitches thrown
// Calculate and emit running statistics (average velocity, pitch type distribution) whenever a new pitch is added
// Allow consumers to subscribe to these statistics
// Handle error cases appropriately

class PitchSequence {
	#newPitches: PitchEvent[] = [];
	#lastFivePitches: PitchEvent[] = [];
	#subscribers = new Set<(pitch: ProcessedPitch) => Promise<void>>();
	#isProcessing = false;

	static readonly HISTORY = 5;

	addPitch(pitch: PitchEvent): void {
		this.#newPitches.push(pitch);
		try {
			if (!this.#isProcessing) {
				this.#isProcessing = true;
				this.#calculateStats();
			}
		} catch (err) {
			this.#isProcessing = false;
			throw err;
		} finally {
			this.#isProcessing = false;
		}
	}
	#calculateStats() {
		while (this.#newPitches.length > 0) {
			let pitch = this.#newPitches.shift();
			// calculate stats
			this.#lastFivePitches.unshift(pitch);
			this.#lastFivePitches = this.#lastFivePitches.slice(
				0,
				PitchSequence.HISTORY
			);

			let avgVelocity =
				this.#lastFivePitches.reduce((acc, pitch) => {
					return acc + pitch.velocity;
				}, 0) / this.#lastFivePitches.length;
			let pitchCoordinates = this.#lastFivePitches.map(
				(p) => pitchCoordinates
			);

			const processed: ProcessedPitch = {
				id: pitch.id,
				timestamp: Date.now(),
				avgVelocity: avgVelocity,
				coordinates: pitchCoordinates
			};

			this.#publish(processed);
		}
	}

	async #publish(processed: ProcessedPitch): Promise<void> {
		const results = await Promise.allSettled(
			[...this.#subscribers].map((sub) => sub(processed))
		);

		results.forEach((result, idx) => {
			if (result.status === 'rejected') {
				console.log(`Error with subscriber: ${idx}`);
			}
		});
	}

	subscribe(
		subscriber: (pitch: ProcessedPitch) => Promise<void>
	): () => void {
		this.#subscribers.add(subscriber);
		return () => this.#subscribers.delete(subscriber);
	}
}

class PitchStream {
	#ws: WebSocket;

	private constructor() {}

	async connect(ws_url: string): Promise<PitchStream> {
		let stream = new PitchStream();
		try {
			new Promise<void>((res, rej) => {
				let ws = new WebSocket(ws_url);
				ws.onopen = () => res();
				ws.onerror = (err) => rej(err);
				this.#ws = ws;
			});
		} catch (err) {
			stream.#ws?.close();
			throw err;
		}
		return stream;
	}

	async *[Symbol.asyncIterator]() {
		while (this.#ws.readyState === WebSocket.OPEN) {
			yield await new Promise<PitchEvent>((res, rej) => {
				this.#ws.onmessage = (msg) => res(JSON.parse(msg.data));
				this.#ws.onerror = (err) => rej(err);
			});
		}
	}
}
