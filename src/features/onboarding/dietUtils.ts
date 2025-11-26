import type { UserProfile } from "../../store/userStore";

export const calculateBMR = (profile: UserProfile): number => {
	const { weight, height, age, gender } = profile;
	// Mifflin-St Jeor Equation
	if (gender === "male") {
		return 10 * weight + 6.25 * height - 5 * age + 5;
	}
	return 10 * weight + 6.25 * height - 5 * age - 161;
};

export const calculateTDEE = (profile: UserProfile): number => {
	const bmr = calculateBMR(profile);
	return Math.round(bmr * profile.activityLevel);
};

export const calculateMacros = (targetCalories: number, weight: number) => {
	// Fat: 1g per kg bodyweight (9 cal/g)
	const fats = weight;
	const fatCalories = fats * 9;

	// Remaining calories for protein and carbs
	const remainingCalories = targetCalories - fatCalories;

	// Protein: 30% of remaining calories (4 cal/g)
	// Carbs: 70% of remaining calories (4 cal/g)
	const protein = Math.round((remainingCalories * 0.3) / 4);
	const carbs = Math.round((remainingCalories * 0.7) / 4);

	return {
		calories: targetCalories,
		protein,
		carbs,
		fats: Math.round(fats),
	};
};
