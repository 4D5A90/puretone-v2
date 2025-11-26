import type { MuscleGroup } from "../features/workout/ExerciseDatabase";
import { exerciseDatabase } from "../features/workout/ExerciseDatabase";
import {
	type WorkoutPlan,
	generateWorkout,
} from "../features/workout/WorkoutGenerator";
import type {
	CompletedWorkout,
	WorkoutRepository,
} from "./storage/WorkoutRepository";

export type FocusLevel = "high" | "medium" | "low";

export class WorkoutService {
	private workoutRepo: WorkoutRepository;

	constructor(workoutRepo: WorkoutRepository) {
		this.workoutRepo = workoutRepo;
	}

	async saveWorkout(workout: CompletedWorkout): Promise<void> {
		return this.workoutRepo.saveWorkout(workout);
	}

	async generatePlan(
		muscleFocus: Record<MuscleGroup, FocusLevel>,
	): Promise<WorkoutPlan> {
		// Logic to adjust volume based on focus will go here
		// For now, we wrap the existing generator
		return generateWorkout(muscleFocus, exerciseDatabase);
	}
}
