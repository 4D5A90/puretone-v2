export type MuscleGroup =
	| "chest"
	| "back"
	| "shoulders"
	| "biceps"
	| "triceps"
	| "quads"
	| "hamstrings"
	| "calves"
	| "abs"
	| "glutes";

export interface Exercise {
	id: string;
	name: string;
	targetMuscles: MuscleGroup[];
	type: "compound" | "isolation";
	equipment: "barbell" | "dumbbell" | "machine" | "bodyweight" | "cables";
	difficulty: "beginner" | "intermediate" | "advanced";
}

export const exerciseDatabase: Exercise[] = [
	// Chest
	{
		id: "bench_press",
		name: "Barbell Bench Press",
		targetMuscles: ["chest", "triceps", "shoulders"],
		type: "compound",
		equipment: "barbell",
		difficulty: "intermediate",
	},
	{
		id: "push_ups",
		name: "Push Ups",
		targetMuscles: ["chest", "triceps", "shoulders"],
		type: "compound",
		equipment: "bodyweight",
		difficulty: "beginner",
	},
	{
		id: "cable_fly",
		name: "Cable Fly",
		targetMuscles: ["chest"],
		type: "isolation",
		equipment: "cables",
		difficulty: "intermediate",
	},

	// Back
	{
		id: "pull_ups",
		name: "Pull Ups",
		targetMuscles: ["back", "biceps"],
		type: "compound",
		equipment: "bodyweight",
		difficulty: "intermediate",
	},
	{
		id: "deadlift",
		name: "Deadlift",
		targetMuscles: ["back", "hamstrings", "glutes"],
		type: "compound",
		equipment: "barbell",
		difficulty: "advanced",
	},
	{
		id: "lat_pulldown",
		name: "Lat Pulldown",
		targetMuscles: ["back", "biceps"],
		type: "compound",
		equipment: "machine",
		difficulty: "beginner",
	},

	// Legs
	{
		id: "squat",
		name: "Barbell Squat",
		targetMuscles: ["quads", "glutes", "hamstrings"],
		type: "compound",
		equipment: "barbell",
		difficulty: "intermediate",
	},
	{
		id: "leg_press",
		name: "Leg Press",
		targetMuscles: ["quads", "glutes"],
		type: "compound",
		equipment: "machine",
		difficulty: "beginner",
	},
	{
		id: "leg_extension",
		name: "Leg Extension",
		targetMuscles: ["quads"],
		type: "isolation",
		equipment: "machine",
		difficulty: "beginner",
	},
	{
		id: "leg_curl",
		name: "Leg Curl",
		targetMuscles: ["hamstrings"],
		type: "isolation",
		equipment: "machine",
		difficulty: "beginner",
	},

	// Shoulders
	{
		id: "overhead_press",
		name: "Overhead Press",
		targetMuscles: ["shoulders", "triceps"],
		type: "compound",
		equipment: "barbell",
		difficulty: "intermediate",
	},
	{
		id: "lateral_raise",
		name: "Lateral Raise",
		targetMuscles: ["shoulders"],
		type: "isolation",
		equipment: "dumbbell",
		difficulty: "beginner",
	},

	// Arms
	{
		id: "bicep_curl",
		name: "Bicep Curl",
		targetMuscles: ["biceps"],
		type: "isolation",
		equipment: "dumbbell",
		difficulty: "beginner",
	},
	{
		id: "tricep_pushdown",
		name: "Tricep Pushdown",
		targetMuscles: ["triceps"],
		type: "isolation",
		equipment: "cables",
		difficulty: "beginner",
	},
];
