import {
	MetabolismAlgorithm,
	type MetabolismAlgorithmType,
	type UserProfile,
} from "../../store/userStore";

// Mifflin-St Jeor Equation (most accurate for general population)
export const calculateBMRMifflinStJeor = (profile: UserProfile): number => {
	const { weight, height, age, gender } = profile;
	if (gender === "male") {
		return 10 * weight + 6.25 * height - 5 * age + 5;
	}
	return 10 * weight + 6.25 * height - 5 * age - 161;
};

// Harris-Benedict Equation (classic formula)
export const calculateBMRHarrisBenedict = (profile: UserProfile): number => {
	const { weight, height, age, gender } = profile;
	if (gender === "male") {
		return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
	}
	return 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
};

// Katch-McArdle Equation (based on lean body mass)
// Uses estimated body fat % since we don't have actual measurements
export const calculateBMRKatchMcArdle = (profile: UserProfile): number => {
	const { weight, gender } = profile;
	// Estimate body fat % based on gender (average values)
	const estimatedBodyFatPercent = gender === "male" ? 0.15 : 0.25;
	const leanBodyMass = weight * (1 - estimatedBodyFatPercent);
	return 370 + 21.6 * leanBodyMass;
};

export const calculateBMR = (
	profile: UserProfile,
	algorithm?: MetabolismAlgorithmType,
): number => {
	const selectedAlgorithm = algorithm || profile.metabolismAlgorithm;

	switch (selectedAlgorithm) {
		case MetabolismAlgorithm.HarrisBenedict:
			return calculateBMRHarrisBenedict(profile);
		case MetabolismAlgorithm.KatchMcArdle:
			return calculateBMRKatchMcArdle(profile);
		case MetabolismAlgorithm.MifflinStJeor:
			return calculateBMRMifflinStJeor(profile);
	}
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
