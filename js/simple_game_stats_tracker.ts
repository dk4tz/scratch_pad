/*
Design and implement a GameStatsTracker class that:
- Stores player statistics for a live baseball game
- Supports O(1) lookup of any player's current stats
- Allows efficient updates as new plays occur
- Maintains a rolling window of the last 20 plays
*/

type PlayerId = string;

interface PlayerStats {
	plateAppearances: number;
	atBats: number;
	walks: number;
	hits: number;
	runs: number;
	rbi: number;
}

type PlayType =
	| 'single'
	| 'double'
	| 'triple'
	| 'homeRun'
	| 'out'
	| 'walk'
	| 'sacrifice';

interface Play {
	playerId: PlayerId;
	type: PlayType;
	runsScored: number;
	timestamp: Date;
}

class GameStatsTracker {
	// data stores
	#playerStats: Map<PlayerId, PlayerStats>;
	#rollingPlays: Play[];

	static readonly MAX_PLAYS: number = 20;

	// constructor
	constructor() {
		this.#playerStats = new Map();
		this.#rollingPlays = [];
	}

	// methods
	recordPlay(play: Play) {
		// first at bat? initialize
		if (!this.#playerStats.has(play.playerId)) {
			this.#playerStats.set(play.playerId, {
				plateAppearances: 0,
				atBats: 0,
				hits: 0,
				runs: 0,
				rbi: 0,
				walks: 0
			});
		}
		let currentStats = this.#playerStats.get(play.playerId);
		let updatedStats = { ...currentStats };

		updatedStats.plateAppearances++;

		switch (play.type) {
			case 'single':
			case 'double':
			case 'triple':
			case 'homeRun':
				updatedStats.atBats++;
				updatedStats.hits++;
				if (play.type === 'homeRun') {
					updatedStats.runs++;
				}
				break;
			case 'walk':
				updatedStats.walks++;
				break;
			case 'out':
				updatedStats.atBats++;
				break;
			case 'sacrifice':
				break;
		}
		updatedStats.rbi += play.runsScored;
		this.#playerStats.set(play.playerId, updatedStats);

		if (this.#rollingPlays.length > GameStatsTracker.MAX_PLAYS) {
			this.#rollingPlays.shift();
		}
		this.#rollingPlays.push(play);
	}

	getStats(playerId: PlayerId): PlayerStats | undefined {
		if (!this.#playerStats.has(playerId)) {
			return undefined;
		} else {
			return { ...this.#playerStats.get(playerId) };
		}
	}

	getPlays(): Play[] {
		return [...this.#rollingPlays];
	}
}

const tracker = new GameStatsTracker();

tracker.recordPlay({
	playerId: 'Shohei',
	type: 'single',
	runsScored: 2,
	timestamp: new Date()
});

tracker.recordPlay({
	playerId: 'Shohei',
	type: 'homeRun',
	runsScored: 4,
	timestamp: new Date()
});

console.log(tracker.getPlays());
console.log(tracker.getStats('Shohei'));
