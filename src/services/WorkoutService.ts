import type {
	WorkoutRepository,
	CompletedWorkout,
} from "./storage/WorkoutRepository";
import {
	generateWorkout,
	type WorkoutPlan,
} from "../features/workout/WorkoutGenerator";
import type { MuscleGroup } from "../features/workout/ExerciseDatabase";

export type FocusLevel = "high" | "medium" | "low";

export class WorkoutService {
	private workoutRepo: WorkoutRepository;

	constructor(workoutRepo: WorkoutRepository) {
		this.workoutRepo = workoutRepo;
	}

	async saveWorkout(workout: CompletedWorkout): Promise<void> {
		return this.workoutRepo.saveWorkout(workout);
	}

	generatePlan(muscleFocus: Record<MuscleGroup, FocusLevel>): WorkoutPlan {
		// Logic to adjust volume based on focus will go here
		// For now, we wrap the existing generator
		return generateWorkout(muscleFocus);
	}
}
