import { create } from "zustand";
import { persist } from "zustand/middleware";

export const ActivityLevel = {
	Sedentary: 1,
	Light: 1.25,
	Moderate: 1.5,
	Active: 1.65,
	VeryActive: 2,
} as const;

export type ActivityLevelType =
	(typeof ActivityLevel)[keyof typeof ActivityLevel];

export const MetabolismAlgorithm = {
	MifflinStJeor: "mifflin-st-jeor",
	HarrisBenedict: "harris-benedict",
	KatchMcArdle: "katch-mcardle",
} as const;

export type MetabolismAlgorithmType =
	(typeof MetabolismAlgorithm)[keyof typeof MetabolismAlgorithm];

export const Goal = {
	cut: 0.8,
	maintain: 1,
	bulk: 1.2,
} as const;

export interface UserProfile {
	age: number;
	height: number; // cm
	weight: number; // kg
	gender: "male" | "female";
	activityLevel: ActivityLevelType;
	goal: keyof typeof Goal;
	estimatedDailySteps: number; // Target steps per day
	metabolismAlgorithm: MetabolismAlgorithmType;
}

interface UserState {
	profile: UserProfile | null;
	setProfile: (profile: UserProfile | null) => void;
	hasCompletedOnboarding: boolean;
	setHasCompletedOnboarding: (status: boolean) => void;
}

export const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			profile: null,
			hasCompletedOnboarding: false,
			setProfile: (profile) => set({ profile }),
			setHasCompletedOnboarding: (status) =>
				set({ hasCompletedOnboarding: status }),
		}),
		{
			name: "puretone-user-storage",
			version: 4, // Increment this to force migration
			migrate: (persistedState: any) => {
				// Migrate old profiles to include estimatedDailySteps, metabolismAlgorithm, and goalValues
				if (persistedState?.profile) {
					const profile = persistedState.profile;

					// Set default estimatedDailySteps if missing
					if (profile.estimatedDailySteps === undefined) {
						profile.estimatedDailySteps = 10000;
					}

					// Set default metabolismAlgorithm if missing
					if (profile.metabolismAlgorithm === undefined) {
						profile.metabolismAlgorithm = MetabolismAlgorithm.MifflinStJeor;
					}

					// Set default goalValues if missing
					if (profile.goalValues === undefined) {
						profile.goalValues = {
							cut: 0.8,
							maintain: 1,
							bulk: 1.2,
						};
					}
				}

				return persistedState as UserState;
			},
		},
	),
);
