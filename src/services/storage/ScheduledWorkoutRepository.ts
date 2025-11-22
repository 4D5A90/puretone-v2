import type { StorageInterface } from "./StorageInterface";

export interface ScheduledWorkout {
	id: string;
	templateId: string;
	templateName: string;
	scheduledDate: string; // ISO date string (YYYY-MM-DD)
	completed: boolean;
	completedAt?: string;
	durationSeconds?: number;
}

export class ScheduledWorkoutRepository {
	private readonly SCHEDULED_KEY = "puretone-scheduled-workouts";
	private readonly INDEX_KEY = "puretone-scheduled-index";
	private storage: StorageInterface;

	constructor(storage: StorageInterface) {
		this.storage = storage;
	}

	async scheduleWorkout(
		templateId: string,
		templateName: string,
		scheduledDate: string,
	): Promise<ScheduledWorkout> {
		const scheduled: ScheduledWorkout = {
			id: crypto.randomUUID(),
			templateId,
			templateName,
			scheduledDate,
			completed: false,
		};

		await this.storage.setItem(
			`${this.SCHEDULED_KEY}-${scheduled.id}`,
			scheduled,
		);

		// Update index
		const index = await this.getIndex();
		index.push(scheduled.id);
		await this.storage.setItem(this.INDEX_KEY, index);

		return scheduled;
	}

	async getScheduledWorkouts(date?: string): Promise<ScheduledWorkout[]> {
		const index = await this.getIndex();
		const workouts: ScheduledWorkout[] = [];

		for (const id of index) {
			const data = await this.storage.getItem<ScheduledWorkout>(
				`${this.SCHEDULED_KEY}-${id}`,
			);
			if (data) {
				if (!date || data.scheduledDate === date) {
					workouts.push(data);
				}
			}
		}

		return workouts.sort(
			(a, b) =>
				new Date(a.scheduledDate).getTime() -
				new Date(b.scheduledDate).getTime(),
		);
	}

	async getTodayWorkout(): Promise<ScheduledWorkout | null> {
		const today = new Date().toISOString().split("T")[0];
		const workouts = await this.getScheduledWorkouts(today);
		return workouts.find((w) => !w.completed) || null;
	}

	async completeWorkout(id: string, durationSeconds: number): Promise<void> {
		const data = await this.storage.getItem<ScheduledWorkout>(
			`${this.SCHEDULED_KEY}-${id}`,
		);
		if (!data) return;

		const workout: ScheduledWorkout = {
			...data,
			completed: true,
			completedAt: new Date().toISOString(),
			durationSeconds,
		};

		await this.storage.setItem(`${this.SCHEDULED_KEY}-${id}`, workout);
	}

	async deleteScheduledWorkout(id: string): Promise<void> {
		await this.storage.removeItem(`${this.SCHEDULED_KEY}-${id}`);

		// Update index
		const index = await this.getIndex();
		const newIndex = index.filter((workoutId) => workoutId !== id);
		await this.storage.setItem(this.INDEX_KEY, newIndex);
	}

	private async getIndex(): Promise<string[]> {
		const data = await this.storage.getItem<string[]>(this.INDEX_KEY);
		return data || [];
	}
}
