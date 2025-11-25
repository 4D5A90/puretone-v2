import type { StorageInterface } from "./StorageInterface";
import {
	type Exercise,
	exerciseDatabase,
	type MuscleGroup,
} from "../../features/workout/ExerciseDatabase";

export class ExerciseRepository {
	private storage: StorageInterface;
	private readonly KEY = "puretone-exercises";

	constructor(storage: StorageInterface) {
		this.storage = storage;
	}

	async getAllExercises(): Promise<Exercise[]> {
		const stored = await this.storage.getItem<Exercise[]>(this.KEY);
		if (!stored) {
			// Initialize with default database if empty
			await this.storage.setItem(this.KEY, exerciseDatabase);
			return exerciseDatabase;
		}
		return stored;
	}

	async getExercisesByMuscle(muscle: MuscleGroup): Promise<Exercise[]> {
		const all = await this.getAllExercises();
		return all.filter((e) => e.targetMuscles.includes(muscle));
	}

	async addExercise(exercise: Exercise): Promise<void> {
		const all = await this.getAllExercises();
		all.push(exercise);
		await this.storage.setItem(this.KEY, all);
	}

	async deleteExercise(id: string): Promise<void> {
		const all = await this.getAllExercises();
		const filtered = all.filter((e) => e.id !== id);
		await this.storage.setItem(this.KEY, filtered);
	}
}
