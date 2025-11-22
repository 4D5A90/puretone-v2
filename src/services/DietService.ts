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
		const sedentaryTDEE = Math.round(baseBMR * 1.2);

		// Add active calories from steps and cardio
		// Estimation: 0.04 kcal per step, 8 kcal per min of cardio (moderate)
		const stepCalories = Math.round(todayActivity.steps * 0.04);
		const cardioCalories = todayActivity.cardioMinutes * 8;

		const totalTDEE = sedentaryTDEE + stepCalories + cardioCalories;

		return {
			macros: calculateMacros(totalTDEE, profile.goal),
			totalTDEE,
			stepCalories,
			steps: todayActivity.steps,
			logs: todayActivity.logs || [],
		};
	}
}
