import { beforeEach, describe, expect, it } from "vitest";
import { ActivityRepository } from "./ActivityRepository";
import type { StorageInterface } from "./StorageInterface";

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

describe("ActivityRepository", () => {
	let repo: ActivityRepository;
	let storage: MockStorage;

	beforeEach(() => {
		storage = new MockStorage();
		repo = new ActivityRepository(storage);
	});

	it("should initialize with zero activity", async () => {
		const today = await repo.getTodayActivity();
		expect(today.steps).toBe(0);
		expect(today.cardio).toBe(0);
		expect(today.water).toBe(0);
	});

	it("should add steps correctly", async () => {
		await repo.addActivity("steps", 1000);
		let today = await repo.getTodayActivity();
		expect(today.steps).toBe(1000);

		await repo.addActivity("steps", 1000);
		today = await repo.getTodayActivity();
		expect(today.steps).toBe(2000);
	});

	it("should add cardio correctly", async () => {
		await repo.addActivity("cardio", 30);
		const today = await repo.getTodayActivity();
		expect(today.cardio).toBe(30);
	});

	it("should add water correctly", async () => {
		await repo.addActivity("water", 1);
		const today = await repo.getTodayActivity();
		expect(today.water).toBe(1);
	});

	it("should log individual activities", async () => {
		await repo.addActivity("steps", 500);
		const today = await repo.getTodayActivity();
		expect(today.logs).toHaveLength(1);
		expect(today.logs[0].type).toBe("steps");
		expect(today.logs[0].amount).toBe(500);
	});

	it("should use local timezone for date, not UTC", async () => {
		// Get today's activity
		const today = await repo.getTodayActivity();

		// Calculate expected date using local timezone
		const now = new Date();
		const expectedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

		// Verify the date matches local timezone
		expect(today.date).toBe(expectedDate);
	});

	it("should create separate activities for different days", async () => {
		// Add activity for today
		await repo.addActivity("steps", 5000);
		const today = await repo.getTodayActivity();
		expect(today.steps).toBe(5000);

		// Manually create activity for a different date
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		const yesterdayDate = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

		await repo.saveActivity({
			date: yesterdayDate,
			steps: 3000,
			cardio: 0,
			water: 0,
			logs: [],
		});

		// Verify today's activity is still separate
		const todayAgain = await repo.getTodayActivity();
		expect(todayAgain.steps).toBe(5000);

		// Verify yesterday's activity is preserved
		const yesterdayActivity = await repo.getActivity(yesterdayDate);
		expect(yesterdayActivity?.steps).toBe(3000);
	});
});
