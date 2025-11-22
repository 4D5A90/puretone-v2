import { useCallback } from "react";
import { ScheduledWorkoutRepository } from "../services/storage/ScheduledWorkoutRepository";
import {
	WorkoutTemplateRepository,
	type WorkoutTemplate,
} from "../services/storage/WorkoutTemplateRepository";
import { LocalStorageAdapter } from "../services/storage/LocalStorageAdapter";
import type { WorkoutSchedule } from "../features/workout/WorkoutGenerator";

const storage = new LocalStorageAdapter();
const scheduledRepo = new ScheduledWorkoutRepository(storage);
const templateRepo = new WorkoutTemplateRepository(storage);

export function useWorkoutScheduling() {
	const scheduleWorkout = useCallback(
		async (schedule: WorkoutSchedule, date: string) => {
			const templateId = schedule.id;
			const templateName =
				"templateName" in schedule
					? (schedule as WorkoutTemplate).templateName
					: `Workout ${new Date().toLocaleDateString()}`;

			// Check if this is already a template
			const existingTemplate = await templateRepo.getTemplate(templateId);
			if (!existingTemplate) {
				await templateRepo.saveTemplate(schedule, templateName);
			}

			await scheduledRepo.scheduleWorkout(templateId, templateName, date);
		},
		[],
	);

	return {
		scheduleWorkout,
	};
}
