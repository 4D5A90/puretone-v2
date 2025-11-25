import { describe, it, expect } from "vitest";
import { generateWorkout, generateSchedule } from "./WorkoutGenerator";
import type { Exercise } from "./ExerciseDatabase";

const mockExercises: Exercise[] = [
	{
		id: "bench",
		name: "Bench Press",
		targetMuscles: ["chest", "triceps"],
		type: "compound",
		equipment: "barbell",
		difficulty: "intermediate",
	},
	{
		id: "incline_bench",
		name: "Incline Bench",
		targetMuscles: ["chest", "shoulders"],
		type: "compound",
		equipment: "barbell",
		difficulty: "intermediate",
	},
	{
		id: "dumbbell_press",
		name: "DB Press",
		targetMuscles: ["chest"],
		type: "compound",
		equipment: "dumbbell",
		difficulty: "intermediate",
	},
	{
		id: "fly",
		name: "Fly",
		targetMuscles: ["chest"],
		type: "isolation",
		equipment: "cables",
		difficulty: "intermediate",
	},
	{
		id: "pec_deck",
		name: "Pec Deck",
		targetMuscles: ["chest"],
		type: "isolation",
		equipment: "machine",
		difficulty: "beginner",
	},
	{
		id: "pushdown",
		name: "Pushdown",
		targetMuscles: ["triceps"],
		type: "isolation",
		equipment: "cables",
		difficulty: "beginner",
	},
	{
		id: "skullcrusher",
		name: "Skullcrusher",
		targetMuscles: ["triceps"],
		type: "isolation",
		equipment: "barbell",
		difficulty: "intermediate",
	},
	{
		id: "squat",
		name: "Squat",
		targetMuscles: ["quads", "glutes"],
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
		id: "leg_ext",
		name: "Leg Ext",
		targetMuscles: ["quads"],
		type: "isolation",
		equipment: "machine",
		difficulty: "beginner",
	},
];

describe("WorkoutGenerator", () => {
	it("should generate high volume for high focus", async () => {
		const plan = await generateWorkout({ chest: "high" }, mockExercises);

		const chestExercises = plan.exercises.filter((e) =>
			e.exercise.targetMuscles.includes("chest"),
		);
		const totalSets = chestExercises.reduce((acc, e) => acc + e.sets, 0);

		expect(totalSets).toBeGreaterThanOrEqual(12);
	});

	it("should generate medium volume for medium focus", async () => {
		const plan = await generateWorkout({ chest: "medium" }, mockExercises);

		const chestExercises = plan.exercises.filter((e) =>
			e.exercise.targetMuscles.includes("chest"),
		);
		const totalSets = chestExercises.reduce((acc, e) => acc + e.sets, 0);

		expect(totalSets).toBeGreaterThanOrEqual(6);
		expect(totalSets).toBeLessThanOrEqual(12);
	});

	it("should generate low volume for low focus", async () => {
		const plan = await generateWorkout({ triceps: "low" }, mockExercises);

		const tricepExercises = plan.exercises.filter((e) =>
			e.exercise.targetMuscles.includes("triceps"),
		);
		const totalSets = tricepExercises.reduce((acc, e) => acc + e.sets, 0);

		expect(totalSets).toBeGreaterThanOrEqual(3);
		expect(totalSets).toBeLessThanOrEqual(5);
	});

	it("should respect priority (High focus processed)", async () => {
		// This is harder to test deterministically without mocking random,
		// but we can check if high focus muscles are present.
		const plan = await generateWorkout(
			{ chest: "high", triceps: "low" },
			mockExercises,
		);

		const chestSets = plan.exercises
			.filter((e) => e.exercise.targetMuscles.includes("chest"))
			.reduce((acc, e) => acc + e.sets, 0);

		const tricepSets = plan.exercises
			.filter((e) => e.exercise.targetMuscles.includes("triceps"))
			.reduce((acc, e) => acc + e.sets, 0);

		expect(chestSets).toBeGreaterThan(tricepSets);
	});

	it("should generate a full schedule", async () => {
		const schedule = await generateSchedule("ppl", 3, mockExercises);

		expect(schedule.days).toHaveLength(3);
		expect(schedule.days[0].name).toBe("Push Day");
		expect(schedule.days[1].name).toBe("Pull Day");
		expect(schedule.days[2].name).toBe("Leg Day");
	});

	it("should not repeat exercises across days in custom split", async () => {
		// Create a scenario with 2 days of Chest High
		// We have 5 chest exercises in mockExercises: bench, incline_bench, dumbbell_press, fly, pec_deck
		// Day 1 (High) needs ~12 sets.
		// It will likely take 3-4 exercises (4+4+4 or 4+3+3+2).
		// Day 2 should use whatever is left, or at least NOT use what Day 1 used.

		const multiDayFocus = [
			{ chest: "high" as const },
			{ chest: "high" as const },
		];

		const schedule = await generateSchedule(
			"custom",
			2,
			mockExercises,
			undefined,
			multiDayFocus,
		);

		const day1Exercises = schedule.days[0].exercises.map((e) => e.exercise.id);
		const day2Exercises = schedule.days[1].exercises.map((e) => e.exercise.id);

		// Check intersection
		const intersection = day1Exercises.filter((id) =>
			day2Exercises.includes(id),
		);

		// Ideally intersection should be empty IF there are enough exercises.
		// In our mock, we have 5 chest exercises.
		// If Day 1 takes 3 exercises, Day 2 has 2 left.
		// Day 2 needs 12 sets. It will try to use the 2 remaining.
		// If it runs out of available exercises, it might fail to reach volume, but it SHOULD NOT reuse excluded ones based on our logic.
		// Our logic filters out excluded exercises: `const muscleExercises = availableExercises.filter...`
		// So it physically cannot pick them.

		expect(intersection).toHaveLength(0);
	});
});
