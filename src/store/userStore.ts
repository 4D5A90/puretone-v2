import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
	age: number;
	height: number; // cm
	weight: number; // kg
	gender: "male" | "female";
	activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
	goal: "cut" | "maintain" | "bulk";
}

interface UserState {
	profile: UserProfile | null;
	setProfile: (profile: UserProfile) => void;
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
		},
	),
);
