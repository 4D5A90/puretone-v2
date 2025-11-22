import type { StorageInterface } from "./StorageInterface";

export interface ActivityLog {
	id: string;
	timestamp: string;
	type: "steps" | "cardio";
	amount: number;
}

export interface DailyActivity {
	date: string; // ISO date string YYYY-MM-DD
	steps: number;
	cardioMinutes: number;
	logs: ActivityLog[];
}

export class ActivityRepository {
	private storage: StorageInterface;
	private readonly KEY_PREFIX = "puretone-activity-";

	constructor(storage: StorageInterface) {
		this.storage = storage;
	}

	private getKey(date: string): string {
		return `${this.KEY_PREFIX}${date}`;
	}

	async getActivity(date: string): Promise<DailyActivity | null> {
		return this.storage.getItem<DailyActivity>(this.getKey(date));
	}

	async saveActivity(activity: DailyActivity): Promise<void> {
		return this.storage.setItem(this.getKey(activity.date), activity);
	}

	async getTodayActivity(): Promise<DailyActivity> {
		const today = new Date().toISOString().split("T")[0];
		const activity = await this.getActivity(today);
		return activity || { date: today, steps: 0, cardioMinutes: 0, logs: [] };
	}

	async addActivity(type: "steps" | "cardio", amount: number): Promise<void> {
		const today = await this.getTodayActivity();
		const log: ActivityLog = {
			id: crypto.randomUUID(),
			timestamp: new Date().toISOString(),
			type,
			amount,
		};

		today.logs.push(log);

		if (type === "steps") {
			today.steps += amount;
		} else {
			today.cardioMinutes += amount;
		}

		await this.saveActivity(today);
	}
}
