import { EventEmitter } from 'events';

type PlayerId = string;
type GameId = string;

interface BaseballEvent {
	type: 'pitch' | 'play';
	gameId: GameId;
	player: PlayerId;
	timestamp: Date;
	data: any;
}

class BaseballDataStream extends EventEmitter {
	#gameId: string;

	#currentBatter: PlayerId = 'Judge';
	#currentPitcher: PlayerId = 'Strasburg';
	gameState: { pitch_count: number };

	constructor(gameId: string) {
		super();
		this.#gameId = gameId;
		this.gameState = {
			pitch_count: 0
		};
	}

	#generatePitch() {
		this.gameState.pitch_count++;
		let pitchData: BaseballEvent = {
			gameId: this.#gameId,
			type: 'pitch',
			player: this.#currentPitcher,
			timestamp: new Date(Date.now()),
			data: {
				speed: 100 * (-0.2 * Math.exp(this.gameState.pitch_count)),
				type: 'fastball'
			}
		};
		return JSON.stringify(pitchData);
	}

	#generatePlay() {
		let playData: BaseballEvent = {
			gameId: this.#gameId,
			type: 'play',
			player: this.#currentBatter,
			timestamp: new Date(Date.now()),
			data: {
				type: ['walk', 'out', 'single', 'double', 'triple', 'home run'][
					Math.floor(Math.random() * 6)
				]
			}
		};
		return JSON.stringify(playData);
	}

	startGame() {
		setInterval(() => {
			let pitch = this.#generatePitch();
			this.emit('pitch_event', pitch);
		}, 1000);
		setInterval(() => {
			let play = this.#generatePlay();
			this.emit('play_event', play);
		}, 3000);
	}
}

let game = new BaseballDataStream('NY_BOS_2025');

game.on('play_event', (play) => {
	console.log(`A BIG PLAY: ${JSON.stringify(JSON.parse(play).data)}`);
});
game.on('pitch_event', (pitch) => {
	console.log(`Here's the pitch: ${JSON.stringify(JSON.parse(pitch).data)}`);
	console.log(`Pitch Count: ${game.gameState.pitch_count}`);
});

game.startGame();
