import type { StorageInterface } from "./StorageInterface";
import type { WorkoutSchedule } from "../../features/workout/WorkoutGenerator";

export interface WorkoutTemplate extends WorkoutSchedule {
	templateName: string;
	createdAt: string;
}

export class WorkoutTemplateRepository {
	private readonly TEMPLATES_KEY = "puretone-workout-templates";
	private readonly INDEX_KEY = "puretone-templates-index";
	private storage: StorageInterface;

	constructor(storage: StorageInterface) {
		this.storage = storage;
	}

	async saveTemplate(
		schedule: WorkoutSchedule,
		templateName: string,
	): Promise<void> {
		const template: WorkoutTemplate = {
			...schedule,
			templateName,
			createdAt: new Date().toISOString(),
		};

		// Save the template
		await this.storage.setItem(
			`${this.TEMPLATES_KEY}-${template.id}`,
			template,
		);

		// Update index
		const index = await this.getIndex();
		if (!index.includes(template.id)) {
			index.push(template.id);
			await this.storage.setItem(this.INDEX_KEY, index);
		}
	}

	async getTemplates(): Promise<WorkoutTemplate[]> {
		const index = await this.getIndex();
		const templates: WorkoutTemplate[] = [];

		for (const id of index) {
			const data = await this.storage.getItem<WorkoutTemplate>(
				`${this.TEMPLATES_KEY}-${id}`,
			);
			if (data) {
				templates.push(data);
			}
		}

		return templates.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		);
	}

	async getTemplate(id: string): Promise<WorkoutTemplate | null> {
		return await this.storage.getItem<WorkoutTemplate>(
			`${this.TEMPLATES_KEY}-${id}`,
		);
	}

	async deleteTemplate(id: string): Promise<void> {
		await this.storage.removeItem(`${this.TEMPLATES_KEY}-${id}`);

		// Update index
		const index = await this.getIndex();
		const newIndex = index.filter((templateId) => templateId !== id);
		await this.storage.setItem(this.INDEX_KEY, newIndex);
	}

	private async getIndex(): Promise<string[]> {
		const data = await this.storage.getItem<string[]>(this.INDEX_KEY);
		return data || [];
	}
}
