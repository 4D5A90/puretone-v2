import type { StorageInterface } from "./StorageInterface";

export const ActivityType = {
	steps: "steps",
	cardio: "min of cardio",
	water: "cl of water",
} as const;

export interface ActivityLog {
	id: string;
	timestamp: string;
	type: keyof typeof ActivityType;
	amount: number;
}

export interface DailyActivity {
	date: string; // ISO date string YYYY-MM-DD
	steps: number;
	cardio: number;
	water: number;
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
		return (
			activity || {
				date: today,
				steps: 0,
				cardio: 0,
				water: 0,
				logs: [],
			}
		);
	}

	async addActivity(
		type: "steps" | "cardio" | "water",
		amount: number,
	): Promise<void> {
		const today = await this.getTodayActivity();
		const log: ActivityLog = {
			id: crypto.randomUUID(),
			timestamp: new Date().toISOString(),
			type,
			amount,
		};

		today.logs.push(log);

		today[type] += amount;

		await this.saveActivity(today);
	}
}
