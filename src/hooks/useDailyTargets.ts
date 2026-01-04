import { useCallback, useEffect, useState } from "react";
import { DietService } from "../services/DietService";
import { ActivityRepository } from "../services/storage/ActivityRepository";
import { storage } from "../services/storage/LocalStorageAdapter";
import { useUserStore } from "../store/userStore";

const activityRepo = new ActivityRepository(storage);
const dietService = new DietService(activityRepo);

export interface DailyTargets {
	macros: {
		calories: number;
		protein: number;
		carbs: number;
		fats: number;
	};
	totalTDEE: number;
	activityCalories: number;
	dailyCaloriesTarget: number;
	steps: number;
	estimatedDailySteps: number;
	logs: Array<{
		id: string;
		timestamp: string;
		type: "steps" | "cardio" | "water";
		amount: number;
	}>;
}

export function useDailyTargets() {
	const profile = useUserStore((state) => state.profile);
	const [data, setData] = useState<DailyTargets | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const loadTargets = useCallback(async () => {
		if (profile) {
			setIsLoading(true);
			const targets = await dietService.getDailyTargets(profile);
			setData(targets);
			setIsLoading(false);
		}
	}, [profile]);

	useEffect(() => {
		loadTargets();
	}, [loadTargets]);

	return {
		targets: data,
		isLoading,
		reload: loadTargets,
	};
}
