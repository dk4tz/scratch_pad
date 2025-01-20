type PlayerStat = {
	player: string;
	hits: number;
	runs: number;
};

type StatsSummary = {
	[player: string]: {
		hits: number;
		runs: number;
	};
};

function aggregateStats(payload: PlayerStat[]): StatsSummary {
	return payload.reduce((acc: StatsSummary, statEntry: PlayerStat) => {
		const { player, hits, runs } = statEntry;

		if (!acc[player]) {
			acc[player] = {
				hits: 0,
				runs: 0
			};
		}
		acc[player].hits += hits;
		acc[player].runs += runs;
		return acc;
	}, {});
}

const stats = [
	{ player: 'Player A', runs: 3, hits: 2 },
	{ player: 'Player B', runs: 1, hits: 3 },
	{ player: 'Player A', runs: 2, hits: 1 }
];
// console.log(aggregateStats(stats));

//////////////////////////////////////

type RawPayload = {
	source: string | null;
	pitchSpeed: number | null;
};

type ValidPayload = {
	source: string;
	pitchSpeed: number;
};

const payloads = [
	{ source: 'camera1', pitchSpeed: 95.4 },
	{ source: 'camera2', pitchSpeed: null },
	null,
	{ source: 'radar1', pitchSpeed: 97.3 }
];

function validatePayload(payload: RawPayload | null): payload is ValidPayload {
	return (
		payload !== null &&
		typeof payload.pitchSpeed === 'number' &&
		typeof payload.source === 'string'
	);
}

const processPayloads = (payloads: (RawPayload | null)[]): ValidPayload[] => {
	return payloads.filter((p) => validatePayload(p));
};

/////////////////////////////////
