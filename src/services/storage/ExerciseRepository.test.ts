import { describe, it, expect, beforeEach } from "vitest";
import { ExerciseRepository } from "./ExerciseRepository";
import type { StorageInterface } from "./StorageInterface";
import type { Exercise } from "../../features/workout/ExerciseDatabase";

// Mock Storage
class MockStorage implements StorageInterface {
	// biome-ignore lint/suspicious/noExplicitAny: any is required for the mock
	private store: Record<string, any> = {};

	async getItem<T>(key: string): Promise<T | null> {
		return this.store[key] || null;
	}

	async setItem<T>(key: string, value: T): Promise<void> {
		this.store[key] = value;
	}

	async removeItem(key: string): Promise<void> {
		delete this.store[key];
	}

	async clear(): Promise<void> {
		this.store = {};
	}
}

describe("ExerciseRepository", () => {
	let repo: ExerciseRepository;
	let storage: MockStorage;

	beforeEach(() => {
		storage = new MockStorage();
		repo = new ExerciseRepository(storage);
	});

	it("should initialize with default exercises", async () => {
		const exercises = await repo.getAllExercises();
		expect(exercises.length).toBeGreaterThan(0);
		// Check for a known default exercise
		expect(exercises.some((e) => e.id === "bench_press")).toBe(true);
	});

	it("should add an exercise", async () => {
		const newExercise: Exercise = {
			id: "custom_press",
			name: "Custom Press",
			targetMuscles: ["chest"],
			type: "compound",
			equipment: "barbell",
			difficulty: "advanced",
		};

		await repo.addExercise(newExercise);
		const exercises = await repo.getAllExercises();
		expect(exercises.some((e) => e.id === "custom_press")).toBe(true);
	});

	it("should delete an exercise", async () => {
		const exercisesBefore = await repo.getAllExercises();
		const idToDelete = exercisesBefore[0].id;

		await repo.deleteExercise(idToDelete);
		const exercisesAfter = await repo.getAllExercises();

		expect(exercisesAfter.length).toBe(exercisesBefore.length - 1);
		expect(exercisesAfter.some((e) => e.id === idToDelete)).toBe(false);
	});

	it("should filter by muscle", async () => {
		const chestExercises = await repo.getExercisesByMuscle("chest");
		expect(chestExercises.length).toBeGreaterThan(0);
		expect(chestExercises.every((e) => e.targetMuscles.includes("chest"))).toBe(
			true,
		);
	});
});
