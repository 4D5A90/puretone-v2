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

export const calculateMacros = (tdee: number, goal: UserProfile["goal"]) => {
	const targetCalories = Math.round(tdee * goal);

	// Standard split: 30% P, 35% C, 35% F (adjustable)
	// Protein: 4 cal/g, Carbs: 4 cal/g, Fat: 9 cal/g

	const protein = Math.round((targetCalories * 0.3) / 4);
	const carbs = Math.round((targetCalories * 0.35) / 4);
	const fats = Math.round((targetCalories * 0.35) / 9);

	return {
		calories: targetCalories,
		protein,
		carbs,
		fats,
	};
};
