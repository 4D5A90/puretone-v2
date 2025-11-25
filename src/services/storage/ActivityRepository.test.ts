import { describe, it, expect, beforeEach, vi } from "vitest";
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
});
