import { Server, WebSocket } from 'mock-socket';
import { GameStream, StatCProcessor } from './statcast_practice';

async function test() {
	// Create mock WebSocket server
	const mockServer1 = new Server('ws://test1');
	const mockServer2 = new Server('ws://test2');

	// Setup event emission
	[mockServer1, mockServer2].forEach((server, i) => {
		const ballparkId = `park${i + 1}`;
		const gameId = `game${i + 1}`;

		setInterval(() => {
			const event: RawStatcastEvent = {
				ballparkId,
				gameId,
				timestamp: Date.now(),
				data: { pitch: Math.floor(85 + Math.random() * 15) }
			};
			server.emit('message', JSON.stringify(event));
		}, 1000);
	});

	// Use the library's WebSocket implementation
	(global as any).WebSocket = WebSocket;

	const processor = new StatCProcessor();
	processor.subscribe(async (event) => {
		console.log('Processed:', event);
	});

	const stream1 = await GameStream.connect('ws://test1');
	const stream2 = await GameStream.connect('ws://test2');

	Promise.all([processor.ingest(stream1), processor.ingest(stream2)]).catch(
		console.error
	);

	// Let it run for a bit
	await new Promise((res) => setTimeout(res, 5000));

	// Cleanup
	stream1.close();
	stream2.close();
	mockServer1.close();
	mockServer2.close();
	console.log('DONE');
}

test().catch(console.error);
