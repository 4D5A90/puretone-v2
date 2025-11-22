import { useState, useCallback } from "react";
import {
	WorkoutRepository,
	type CompletedWorkout,
} from "../services/storage/WorkoutRepository";
import { LocalStorageAdapter } from "../services/storage/LocalStorageAdapter";

const storage = new LocalStorageAdapter();
const workoutRepo = new WorkoutRepository(storage);

export function useWorkoutHistory() {
	const [history, setHistory] = useState<CompletedWorkout[]>([]);
	const [loading, setLoading] = useState(false);

	const loadHistory = useCallback(async () => {
		setLoading(true);
		try {
			const workouts = await workoutRepo.getWorkouts();
			setHistory(workouts);
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		history,
		loading,
		loadHistory,
	};
}
