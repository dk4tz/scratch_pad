type PEvent = {
	timestamp: number;
	ballparkId: string;
	gameId: string;
	data: any;
};

class PStream {
	static readonly POLL_INTERVAL = 1000;
	#url: string;
	#isPolling: boolean;

	private constructor() {
		this.#isPolling = false;
	}

	async connect(url: string): Promise<PStream> {
		const stream = new PStream();
		stream.#url = url;

		try {
			let result = await fetch(url);
			if (!result.ok) {
				throw new Error(`HTTP ERROR: ${result.status}`);
			}
		} catch (err) {
			throw new Error(`Failed to connect to ${url}`);
		}
		return stream;
	}

	async *[Symbol.asyncIterator](): AsyncIterator<PEvent> {
		this.#isPolling = true;

		while (this.#isPolling) {
			try {
				let response = await fetch(this.#url);
				if (!response.ok) {
					throw new Error('Something wrong');
				}
				const pevent: PEvent = await response.json();
				yield pevent;

				await new Promise<void>((res, rej) =>
					setTimeout(res, PStream.POLL_INTERVAL)
				);
			} catch (err) {
				this.#isPolling = false;
				throw new Error('Something else wrong');
			}
		}
	}

	close() {
		this.#isPolling = false;
	}
}
