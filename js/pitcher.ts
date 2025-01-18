// Exercise 1: Create a simple Pitcher class
// Requirements:
// - Track pitcher name and number (public)
// - Track pitch count and average velocity (private)
// - Provide methods to add a pitch and get statistics
// - Ensure pitch velocity is valid (between 60-105 mph)

interface IPitcher {
	player_name: string;
	player_number: number;
}

interface PitcherStats {
	avg_velocity: number;
	pitch_count: number;
}

class Pitcher {
	readonly pitcher: IPitcher;
	#pitch_count: number;
	#total_velocity: number;

	constructor(name: string, number: number) {
		this.pitcher = {
			player_name: name,
			player_number: number
		};
		this.#pitch_count = 0;
		this.#total_velocity = 0;
	}

	addPitch(velocity: number): boolean {
		this.#pitch_count++;
		try {
			if (!this.#validatePitch(velocity)) return false;

			this.#pitch_count++;
			this.#total_velocity += velocity;
			return true;
		} catch (error) {
			console.error(`Problem processing pitch: ${error}`);
			return false;
		}
	}

	getStats(): PitcherStats {
		return {
			pitch_count: this.#pitch_count,
			avg_velocity: Math.round(this.#total_velocity / this.#pitch_count)
		};
	}

	#validatePitch(velocity: number): boolean {
		return 50 < velocity && velocity < 150 ? true : false;
	}
}

// Test cases
const pitcher = new Pitcher('Shohei Ohtani', 17);
pitcher.addPitch(95.5);
pitcher.addPitch(92.3);
console.log(pitcher.getStats()); // Should show pitch count and avg velocity
console.log(pitcher.addPitch(150)); // Should reject invalid velocity
