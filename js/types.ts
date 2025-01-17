export type PlayerId = string;
export type PlayerAction<T extends { type: string }> = {
	by: PlayerId;
	action: T;
};

export const pitches = ['fast', 'curve', 'knuckle', 'split'] as const;
export const hits = ['single', 'double', 'triple', 'home run'] as const;
export const outs = ['pop out', 'ground out', 'strike out'] as const;

export type PitchType = (typeof pitches)[number];
export type HitType = (typeof hits)[number];
export type OutType = (typeof outs)[number];

export type BaseballGameEvent =
	| PlayerAction<{
			type: 'pitch';
			data: {
				type: PitchType;
				speed: number;
			};
	  }>
	| PlayerAction<{ type: 'hit'; data: { type: HitType } }>
	| PlayerAction<{ type: 'out'; data: { type: OutType } }>;

// function generateBaseballStreamData(interval: number) {
// 	return setInterval(() => {
// 		const events: BaseballGameEvent[] = [
// 			{
// 				by: 'Clayton Kershaw',
// 				action: {
// 					type: 'pitch',
// 					data: {
// 						type: pitches[
// 							Math.floor(Math.random() * pitches.length)
// 						],
// 						speed: Math.floor(Math.random() * 5 + 95)
// 					}
// 				}
// 			},
// 			{
// 				by: 'Derek Jeter',
// 				action: {
// 					type: 'hit',
// 					data: {
// 						type: hits[Math.floor(Math.random() * hits.length)]
// 					}
// 				}
// 			},
// 			{
// 				by: 'David Ortiz',
// 				action: {
// 					type: 'out',
// 					data: {
// 						type: outs[Math.floor(Math.random() * outs.length)]
// 					}
// 				}
// 			}
// 		];
// 		return events[Math.floor(Math.random() * events.length)];
// 	}, interval);
// }

// console.log(generateBaseballStreamData(1000));
