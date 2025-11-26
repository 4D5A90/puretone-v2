import { History, LayoutTemplate, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { WorkoutSchedule } from "../features/workout/WorkoutGenerator";
import { CustomSplitConfiguration } from "../features/workout/components/CustomSplitConfiguration";
import { GeneratedScheduleView } from "../features/workout/components/GeneratedScheduleView";
import { SaveTemplateModal } from "../features/workout/components/SaveTemplateModal";
import { ScheduleWorkoutModal } from "../features/workout/components/ScheduleWorkoutModal";
import { WorkoutHistoryView } from "../features/workout/components/WorkoutHistoryView";
import { WorkoutTemplatesView } from "../features/workout/components/WorkoutTemplatesView";
import { useCustomSplit } from "../hooks/useCustomSplit";
import { useWorkoutGeneration } from "../hooks/useWorkoutGeneration";
import { useWorkoutHistory } from "../hooks/useWorkoutHistory";
import { useWorkoutScheduling } from "../hooks/useWorkoutScheduling";
import { useWorkoutTemplates } from "../hooks/useWorkoutTemplates";
import type { CompletedWorkout } from "../services/storage/WorkoutRepository";
import type { WorkoutTemplate } from "../services/storage/WorkoutTemplateRepository";

import type { MuscleGroup } from "../features/workout/ExerciseDatabase";
import { WorkoutBuilderView } from "../features/workout/WorkoutBuilderView";
import type { FocusLevel } from "../services/WorkoutService";

// ... imports

export default function WorkoutPage() {
	const navigate = useNavigate();

	// Hooks
	const { history, loadHistory } = useWorkoutHistory();
	const { templates, loadTemplates, saveTemplate } = useWorkoutTemplates();
	const { scheduleWorkout } = useWorkoutScheduling();
	const {
		customSplitType,
		daysPerWeek,
		setDaysPerWeek,
		repRanges,
		setRepRanges,
		columns,
		customDayColumns,
		getCurrentColumns,
		updateCurrentColumns,
		moveMuscle,
	} = useCustomSplit();
	const {
		generatedSchedule,
		setGeneratedSchedule,
		selectedDayIndex,
		setSelectedDayIndex,
		selectedSplit,
		setSelectedSplit,
		generate,
		updateExerciseSets,
		reset,
	} = useWorkoutGeneration();

	// UI State
	const [showHistory, setShowHistory] = useState(false);
	const [showTemplates, setShowTemplates] = useState(false);
	const [showSaveTemplate, setShowSaveTemplate] = useState(false);
	const [templateName, setTemplateName] = useState("");
	const [showSchedule, setShowSchedule] = useState(false);
	const [scheduleDate, setScheduleDate] = useState("");
	const [showBuilder, setShowBuilder] = useState(false);

	// Handlers
	const handleGenerateSchedule = () => {
		if (!selectedSplit) return;

		if (selectedSplit === "custom") {
			setShowBuilder(true);
			return;
		}

		generate(
			selectedSplit,
			daysPerWeek,
			customSplitType,
			columns,
			customDayColumns,
			repRanges,
		);
	};

	const handleBuilderComplete = (schedule: WorkoutSchedule) => {
		setGeneratedSchedule(schedule);
		setSelectedDayIndex(0);
		setShowBuilder(false);
		setSelectedSplit(null);
	};

	const handleStart = () => {
		if (!generatedSchedule) return;
		const currentWorkout = generatedSchedule.days[selectedDayIndex];
		navigate("/workout/active", { state: { workout: currentWorkout } });
	};

	const handleLoadHistory = async () => {
		await loadHistory();
		setShowHistory(true);
	};

	const handleSelectHistory = (workout: CompletedWorkout) => {
		const schedule: WorkoutSchedule = {
			id: crypto.randomUUID(),
			splitType: "custom",
			days: [workout],
		};
		setGeneratedSchedule(schedule);
		setSelectedDayIndex(0);
		setShowHistory(false);
		setSelectedSplit(null);
	};

	const handleLoadTemplates = async () => {
		await loadTemplates();
		setShowTemplates(true);
	};

	const handleSelectTemplate = (template: WorkoutTemplate) => {
		setGeneratedSchedule(template);
		setSelectedDayIndex(0);
		setShowTemplates(false);
		setSelectedSplit(null);
	};

	const handleConfirmSaveTemplate = async () => {
		if (!generatedSchedule || !templateName.trim()) return;
		await saveTemplate(generatedSchedule, templateName);
		setTemplateName("");
		setShowSaveTemplate(false);
		alert("Template saved!");
	};

	const handleConfirmSchedule = async () => {
		if (!generatedSchedule || !scheduleDate) return;
		await scheduleWorkout(generatedSchedule, scheduleDate);
		setShowSchedule(false);
		alert(`Workout scheduled for ${scheduleDate}!`);
	};

	const hasSelection =
		columns.high.length > 0 ||
		columns.medium.length > 0 ||
		columns.low.length > 0;

	// Helper to extract focus from columns
	const getInitialFocus = (): Partial<Record<MuscleGroup, FocusLevel>> => {
		const focus: Partial<Record<MuscleGroup, FocusLevel>> = {};

		// Always use global columns now
		for (const m of columns.high) focus[m] = "high";
		for (const m of columns.medium) focus[m] = "medium";
		for (const m of columns.low) focus[m] = "low";

		return focus;
	};

	if (showHistory) {
		return (
			<WorkoutHistoryView
				history={history}
				onSelect={handleSelectHistory}
				onClose={() => setShowHistory(false)}
			/>
		);
	}

	if (showBuilder) {
		return (
			<WorkoutBuilderView
				initialDays={daysPerWeek}
				initialFocus={getInitialFocus()}
				onComplete={handleBuilderComplete}
				onBack={() => setShowBuilder(false)}
			/>
		);
	}

	return (
		<div className="h-full flex flex-col">
			<header className="mb-6 flex-none">
				<h1 className="text-2xl font-bold">Workout Planner</h1>
				<p className="text-zinc-400 text-sm">
					{selectedSplit
						? "Configure your split"
						: "What would you like to do?"}
				</p>
			</header>

			{!generatedSchedule ? (
				selectedSplit === "custom" ? (
					<CustomSplitConfiguration
						daysPerWeek={daysPerWeek}
						setDaysPerWeek={setDaysPerWeek}
						repRanges={repRanges}
						setRepRanges={setRepRanges}
						currentColumns={getCurrentColumns()}
						updateCurrentColumns={updateCurrentColumns}
						moveMuscle={moveMuscle}
						onGenerate={handleGenerateSchedule}
						hasSelection={hasSelection}
					/>
				) : (
					<div className="flex-1 flex flex-col gap-4 p-4">
						<button
							type="button"
							onClick={() => setSelectedSplit("custom")}
							className="w-full p-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex flex-col items-start gap-2 hover:scale-[1.02] transition-transform"
						>
							<div className="p-2 bg-white/10 rounded-lg">
								<Plus className="text-white" size={24} />
							</div>
							<div className="text-left">
								<h3 className="text-lg font-bold text-white">
									Create Custom Split
								</h3>
								<p className="text-blue-200 text-sm">
									Build a program from scratch
								</p>
							</div>
						</button>

						<div className="grid grid-cols-2 gap-4">
							<button
								type="button"
								onClick={handleLoadTemplates}
								className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-start gap-3 hover:bg-zinc-800 transition-colors"
							>
								<div className="p-2 bg-green-500/10 rounded-lg">
									<LayoutTemplate className="text-green-500" size={20} />
								</div>
								<div className="text-left">
									<h3 className="font-medium text-zinc-200">Templates</h3>
									<p className="text-zinc-500 text-xs">Saved programs</p>
								</div>
							</button>

							<button
								type="button"
								onClick={handleLoadHistory}
								className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-start gap-3 hover:bg-zinc-800 transition-colors"
							>
								<div className="p-2 bg-blue-500/10 rounded-lg">
									<History className="text-blue-500" size={20} />
								</div>
								<div className="text-left">
									<h3 className="font-medium text-zinc-200">History</h3>
									<p className="text-zinc-500 text-xs">Past workouts</p>
								</div>
							</button>
						</div>
					</div>
				)
			) : (
				<GeneratedScheduleView
					schedule={generatedSchedule}
					selectedDayIndex={selectedDayIndex}
					setSelectedDayIndex={setSelectedDayIndex}
					onReset={reset}
					onUpdateSets={updateExerciseSets}
					onSaveTemplate={() => setShowSaveTemplate(true)}
					onSchedule={() => {
						const today = new Date().toISOString().split("T")[0];
						setScheduleDate(today);
						setShowSchedule(true);
					}}
					onStart={handleStart}
				/>
			)}

			{showSaveTemplate && (
				<SaveTemplateModal
					templateName={templateName}
					setTemplateName={setTemplateName}
					onConfirm={handleConfirmSaveTemplate}
					onCancel={() => setShowSaveTemplate(false)}
				/>
			)}

			{showTemplates && (
				<WorkoutTemplatesView
					templates={templates}
					onSelect={handleSelectTemplate}
					onClose={() => setShowTemplates(false)}
				/>
			)}

			{showSchedule && (
				<ScheduleWorkoutModal
					scheduleDate={scheduleDate}
					setScheduleDate={setScheduleDate}
					onConfirm={handleConfirmSchedule}
					onCancel={() => setShowSchedule(false)}
				/>
			)}
		</div>
	);
}
