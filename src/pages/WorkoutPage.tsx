import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkoutHistory } from "../hooks/useWorkoutHistory";
import { useWorkoutTemplates } from "../hooks/useWorkoutTemplates";
import { useWorkoutScheduling } from "../hooks/useWorkoutScheduling";
import { useCustomSplit } from "../hooks/useCustomSplit";
import { useWorkoutGeneration } from "../hooks/useWorkoutGeneration";
import { WorkoutHistoryView } from "../features/workout/components/WorkoutHistoryView";
import { WorkoutTemplatesView } from "../features/workout/components/WorkoutTemplatesView";
import { SaveTemplateModal } from "../features/workout/components/SaveTemplateModal";
import { ScheduleWorkoutModal } from "../features/workout/components/ScheduleWorkoutModal";
import { SplitSelectionView } from "../features/workout/components/SplitSelectionView";
import { CustomSplitConfiguration } from "../features/workout/components/CustomSplitConfiguration";
import { GeneratedScheduleView } from "../features/workout/components/GeneratedScheduleView";
import type { CompletedWorkout } from "../services/storage/WorkoutRepository";
import type { WorkoutTemplate } from "../services/storage/WorkoutTemplateRepository";
import type { WorkoutSchedule } from "../features/workout/WorkoutGenerator";

export default function WorkoutPage() {
	const navigate = useNavigate();

	// Hooks
	const { history, loadHistory } = useWorkoutHistory();
	const { templates, loadTemplates, saveTemplate } = useWorkoutTemplates();
	const { scheduleWorkout } = useWorkoutScheduling();
	const {
		customSplitType,
		setCustomSplitType,
		daysPerWeek,
		setDaysPerWeek,
		currentCustomDay,
		setCurrentCustomDay,
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

	// Handlers
	const handleGenerateSchedule = () => {
		if (!selectedSplit) return;
		generate(
			selectedSplit,
			daysPerWeek,
			customSplitType,
			columns,
			customDayColumns,
			repRanges,
		);
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
		customSplitType === "single"
			? columns.high.length > 0 ||
				columns.medium.length > 0 ||
				columns.low.length > 0
			: Object.values(customDayColumns).some(
					(day) =>
						day.high.length > 0 || day.medium.length > 0 || day.low.length > 0,
				);

	if (showHistory) {
		return (
			<WorkoutHistoryView
				history={history}
				onSelect={handleSelectHistory}
				onClose={() => setShowHistory(false)}
			/>
		);
	}

	return (
		<div className="h-full flex flex-col">
			<header className="mb-4 flex-none flex justify-between items-end">
				<div>
					<h1 className="text-2xl font-bold">Workout Planner</h1>
					<p className="text-zinc-400 text-sm">
						{selectedSplit ? "Your workout plan" : "Choose your split"}
					</p>
				</div>
				<div className="flex gap-3">
					<button
						type="button"
						onClick={handleLoadTemplates}
						className="text-sm text-green-400 hover:text-green-300"
					>
						Load Templates
					</button>
					<button
						type="button"
						onClick={handleLoadHistory}
						className="text-sm text-blue-400 hover:text-blue-300"
					>
						Load History
					</button>
				</div>
			</header>

			{!generatedSchedule ? (
				selectedSplit === "custom" ? (
					<CustomSplitConfiguration
						customSplitType={customSplitType}
						setCustomSplitType={setCustomSplitType}
						daysPerWeek={daysPerWeek}
						setDaysPerWeek={setDaysPerWeek}
						currentCustomDay={currentCustomDay}
						setCurrentCustomDay={setCurrentCustomDay}
						repRanges={repRanges}
						setRepRanges={setRepRanges}
						currentColumns={getCurrentColumns()}
						updateCurrentColumns={updateCurrentColumns}
						moveMuscle={moveMuscle}
						onGenerate={handleGenerateSchedule}
						hasSelection={hasSelection}
					/>
				) : (
					<SplitSelectionView
						selectedSplit={selectedSplit}
						onSelectSplit={setSelectedSplit}
						daysPerWeek={daysPerWeek}
						setDaysPerWeek={setDaysPerWeek}
						onGenerate={handleGenerateSchedule}
					/>
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
