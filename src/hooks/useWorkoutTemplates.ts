import { useState, useCallback } from "react";
import {
	WorkoutTemplateRepository,
	type WorkoutTemplate,
} from "../services/storage/WorkoutTemplateRepository";
import { LocalStorageAdapter } from "../services/storage/LocalStorageAdapter";
import type { WorkoutSchedule } from "../features/workout/WorkoutGenerator";

const storage = new LocalStorageAdapter();
const templateRepo = new WorkoutTemplateRepository(storage);

export function useWorkoutTemplates() {
	const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
	const [loading, setLoading] = useState(false);

	const loadTemplates = useCallback(async () => {
		setLoading(true);
		try {
			const loadedTemplates = await templateRepo.getTemplates();
			setTemplates(loadedTemplates);
		} finally {
			setLoading(false);
		}
	}, []);

	const saveTemplate = useCallback(
		async (schedule: WorkoutSchedule, name: string) => {
			await templateRepo.saveTemplate(schedule, name);
		},
		[],
	);

	return {
		templates,
		loading,
		loadTemplates,
		saveTemplate,
	};
}
