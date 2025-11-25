import type { UserProfile } from "../store/userStore";
import {
	calculateBMR,
	calculateMacros,
} from "../features/onboarding/dietUtils";
import type { ActivityRepository } from "./storage/ActivityRepository";

export class DietService {
	private activityRepo: ActivityRepository;

	constructor(activityRepo: ActivityRepository) {
		this.activityRepo = activityRepo;
	}

	async getDailyTargets(profile: UserProfile) {
		// Get today's activity
		const todayActivity = await this.activityRepo.getTodayActivity();

		// Calculate Base TDEE (Sedentary)
		const baseBMR = calculateBMR(profile);

		// Add active calories from steps and cardio
		// Estimation: 0.04 kcal per step, 8 kcal per min of cardio (moderate)
		const stepCalories = Math.round(todayActivity.steps * 0.04);
		const cardioCalories = todayActivity.cardio * 8;

		const totalTDEE = Math.round(
			(baseBMR + stepCalories + cardioCalories) * profile.activityLevel,
		);

		const dailyCaloriesTarget = Math.round(totalTDEE * profile.goal);

		return {
			macros: calculateMacros(totalTDEE, profile.goal),
			totalTDEE,
			stepCalories,
			dailyCaloriesTarget,
			steps: todayActivity.steps,
			estimatedDailySteps: profile.estimatedDailySteps,
			logs: todayActivity.logs || [],
		};
	}
}
