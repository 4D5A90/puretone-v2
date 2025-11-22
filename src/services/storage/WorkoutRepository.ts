import type { StorageInterface } from "./StorageInterface";
import type { WorkoutPlan } from "../../features/workout/WorkoutGenerator";

export interface CompletedWorkout extends WorkoutPlan {
	date: string;
	durationSeconds: number;
	// We could add actual reps/weight logged here later
}

export class WorkoutRepository {
	private storage: StorageInterface;
	private readonly KEY_PREFIX = "puretone-workout-";

	private readonly INDEX_KEY = "puretone-workouts-index";

	constructor(storage: StorageInterface) {
		this.storage = storage;
	}

	private getKey(id: string): string {
		return `${this.KEY_PREFIX}${id}`;
	}

	async saveWorkout(workout: CompletedWorkout): Promise<void> {
		await this.storage.setItem(this.getKey(workout.id), workout);
		await this.addToIndex(workout.id);
	}

	async getWorkouts(): Promise<CompletedWorkout[]> {
		const index = await this.getIndex();
		const workouts = await Promise.all(
			index.map((id) =>
				this.storage.getItem<CompletedWorkout>(this.getKey(id)),
			),
		);
		return workouts.filter((w): w is CompletedWorkout => w !== null);
	}

	private async getIndex(): Promise<string[]> {
		return (await this.storage.getItem<string[]>(this.INDEX_KEY)) || [];
	}

	private async addToIndex(id: string): Promise<void> {
		const index = await this.getIndex();
		if (!index.includes(id)) {
			await this.storage.setItem(this.INDEX_KEY, [id, ...index]);
		}
	}
}
