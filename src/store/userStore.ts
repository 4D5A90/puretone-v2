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

export const Goal = {
	Cut: 0.8,
	Maintain: 1,
	Bulk: 1.2,
} as const;

export type GoalType = (typeof Goal)[keyof typeof Goal];

export interface UserProfile {
	age: number;
	height: number; // cm
	weight: number; // kg
	gender: "male" | "female";
	activityLevel: ActivityLevelType;
	goal: GoalType;
	estimatedDailySteps: number; // Target steps per day
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
			version: 1, // Increment this to force migration
			migrate: (persistedState: any) => {
				// Migrate old profiles to include estimatedDailySteps
				if (persistedState?.profile) {
					const profile = persistedState.profile;

					// Set default estimatedDailySteps if missing
					if (profile.estimatedDailySteps === undefined) {
						profile.estimatedDailySteps = 10000;
					}
				}

				return persistedState as UserState;
			},
		},
	),
);
