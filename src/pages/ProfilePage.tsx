import {
	Activity,
	Calendar,
	ChevronDown,
	Footprints,
	Pencil,
	Ruler,
	Save,
	Target,
	Trash2,
	User,
	Weight,
	X,
} from "lucide-react";
import { useState } from "react";
import {
	ActivityLevel,
	type ActivityLevelType,
	type Goal,
	MetabolismAlgorithm,
	type MetabolismAlgorithmType,
	type UserProfile,
	useUserStore,
} from "../store/userStore";

const ACTIVITY_LABELS: Record<ActivityLevelType, string> = {
	[ActivityLevel.Sedentary]: "Sedentary",
	[ActivityLevel.Light]: "Light",
	[ActivityLevel.Moderate]: "Moderate",
	[ActivityLevel.Active]: "Active",
	[ActivityLevel.VeryActive]: "Very Active",
};

const GOAL_LABELS: Record<Goal, string> = {
	cut: "Cut",
	maintain: "Maintain",
	bulk: "Bulk",
};

const METABOLISM_ALGORITHM_LABELS: Record<MetabolismAlgorithmType, string> = {
	[MetabolismAlgorithm.MifflinStJeor]: "Mifflin-St Jeor",
	[MetabolismAlgorithm.HarrisBenedict]: "Harris-Benedict",
	[MetabolismAlgorithm.KatchMcArdle]: "Katch-McArdle",
};

const METABOLISM_ALGORITHM_DESCRIPTIONS: Record<
	MetabolismAlgorithmType,
	string
> = {
	[MetabolismAlgorithm.MifflinStJeor]:
		"Most accurate for general population (recommended)",
	[MetabolismAlgorithm.HarrisBenedict]: "Classic formula, slightly higher",
	[MetabolismAlgorithm.KatchMcArdle]: "Based on lean body mass estimation",
};

export default function ProfilePage() {
	const userStore = useUserStore();
	const profile = userStore.profile;
	const [isEditing, setIsEditing] = useState(false);
	const [editForm, setEditForm] = useState<UserProfile | null>(null);
	const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

	if (!profile) return null;

	const handleEdit = () => {
		setEditForm({ ...profile });
		setIsEditing(true);
	};

	const handleCancel = () => {
		setIsEditing(false);
		setEditForm(null);
	};

	const handleSave = () => {
		if (editForm) {
			userStore.setProfile(editForm);
			setIsEditing(false);
			setEditForm(null);
		}
	};

	const handleReset = () => {
		if (
			confirm(
				"Are you sure you want to reset all data? This will clear your profile and all activity data.",
			)
		) {
			// Clear all localStorage
			localStorage.clear();
			// Reset the store
			userStore.setProfile(null);
			userStore.setHasCompletedOnboarding(false);
			// Reload the page to go back to onboarding
			window.location.reload();
		}
	};

	const items = [
		{
			id: "age",
			label: "Age",
			value: `${profile.age} years`,
			editValue: editForm?.age,
			type: "number",
			icon: Calendar,
			color: "text-blue-500",
			bg: "bg-blue-500/10 border-blue-500/20",
		},
		{
			id: "gender",
			label: "Gender",
			value: profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1),
			editValue: editForm?.gender,
			type: "select",
			options: [
				{ value: "male", label: "Male" },
				{ value: "female", label: "Female" },
			],
			icon: User,
			color: "text-purple-500",
			bg: "bg-purple-500/10 border-purple-500/20",
		},
		{
			id: "height",
			label: "Height",
			value: `${profile.height} cm`,
			editValue: editForm?.height,
			type: "number",
			icon: Ruler,
			color: "text-green-500",
			bg: "bg-green-500/10 border-green-500/20",
		},
		{
			id: "weight",
			label: "Weight",
			value: `${profile.weight} kg`,
			editValue: editForm?.weight,
			type: "number",
			icon: Weight,
			color: "text-orange-500",
			bg: "bg-orange-500/10 border-orange-500/20",
		},
		{
			id: "activityLevel",
			label: "Activity",
			value: ACTIVITY_LABELS[profile.activityLevel],
			editValue: editForm?.activityLevel,
			type: "select",
			options: Object.values(ActivityLevel).map((val) => ({
				value: val,
				label: ACTIVITY_LABELS[val as ActivityLevelType],
			})),
			icon: Activity,
			color: "text-red-500",
			bg: "bg-red-500/10 border-red-500/20",
		},
		{
			id: "estimatedDailySteps",
			label: "Daily Steps",
			value: `${profile.estimatedDailySteps} steps`,
			editValue: editForm?.estimatedDailySteps,
			type: "number",
			icon: Footprints,
			color: "text-cyan-500",
			bg: "bg-cyan-500/10 border-cyan-500/20",
		},
		{
			id: "goal",
			label: "Goal",
			value: GOAL_LABELS[profile.goal],
			editValue: editForm?.goal,
			type: "select",
			options: Object.keys(profile.goalValues).map((key) => ({
				value: key,
				label: GOAL_LABELS[key as Goal],
			})),
			icon: Target,
			color: "text-yellow-500",
			bg: "bg-yellow-500/10 border-yellow-500/20",
		},
	];

	return (
		<div className="space-y-6 pb-20">
			<header className="flex justify-between items-start">
				<div>
					<h1 className="text-2xl font-bold">Profile</h1>
					<p className="text-zinc-400 text-sm">Your personal stats</p>
				</div>
				{!isEditing ? (
					<button
						type="button"
						onClick={handleEdit}
						className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
					>
						<Pencil size={20} />
					</button>
				) : (
					<div className="flex gap-2">
						<button
							type="button"
							onClick={handleCancel}
							className="p-2 bg-zinc-800 rounded-lg text-red-400 hover:text-red-300 hover:bg-zinc-700 transition-colors"
						>
							<X size={20} />
						</button>
						<button
							type="button"
							onClick={handleSave}
							className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500 transition-colors"
						>
							<Save size={20} />
						</button>
					</div>
				)}
			</header>
			<div className="bg-zinc-900 rounded-2xl border border-zinc-800 divide-y divide-zinc-800">
				{items.map((item) => (
					<div
						key={item.label}
						className="p-2 flex items-center justify-between gap-4"
					>
						{/* Left: Icon + Label */}
						<div className="flex items-center gap-3">
							<item.icon size={18} className={item.color} />
							<p className="text-sm text-zinc-300 font-medium">{item.label}</p>
						</div>

						{/* Right: Value (editable) */}
						<div className="flex-shrink-0">
							{isEditing ? (
								item.type === "select" ? (
									<select
										value={item.editValue as string | number}
										onChange={(e) =>
											setEditForm((prev) =>
												prev
													? {
															...prev,
															[item.id]:
																item.id === "gender"
																	? e.target.value
																	: Number(e.target.value),
														}
													: null,
											)
										}
										className="bg-zinc-800 border border-zinc-700 rounded-lg px-3  text-sm text-white focus:outline-none focus:border-blue-500"
									>
										{item.options?.map((opt) => (
											<option key={opt.value} value={opt.value}>
												{opt.label}
											</option>
										))}
									</select>
								) : (
									<input
										type="number"
										value={item.editValue as number}
										onChange={(e) =>
											setEditForm((prev) =>
												prev
													? { ...prev, [item.id]: Number(e.target.value) }
													: null,
											)
										}
										className="bg-zinc-800 border border-zinc-700 rounded-lg px-3  text-sm text-white text-right w-24 focus:outline-none focus:border-blue-500"
									/>
								)
							) : (
								<p className="text-base font-semibold text-white">
									{item.value}
								</p>
							)}
						</div>
					</div>
				))}
			</div>

			{/* Advanced Options Accordion */}
			<div className="mt-6">
				<button
					type="button"
					onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
					className="w-full bg-zinc-900 rounded-2xl border border-zinc-800 p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
				>
					<div className="flex items-center gap-3">
						<div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
							<Target size={18} className="text-purple-500" />
						</div>
						<div className="text-left">
							<h2 className="text-base font-semibold text-white">
								Advanced Options
							</h2>
							<p className="text-xs text-zinc-400">
								Goal type & metabolism algorithm
							</p>
						</div>
					</div>
					<ChevronDown
						size={20}
						className={`text-zinc-400 transition-transform ${
							isAdvancedOpen ? "rotate-180" : ""
						}`}
					/>
				</button>

				{isAdvancedOpen && (
					<div className="mt-2 bg-zinc-900 rounded-2xl border border-zinc-800 divide-y divide-zinc-800">
						{/* Goal Values */}
						<div className="p-3">
							<div className="flex items-center gap-2 mb-2">
								<Target size={16} className="text-yellow-500" />
								<p className="text-sm text-zinc-300 font-medium">
									Goal Multipliers
								</p>
							</div>
							<div className="space-y-2">
								{Object.keys(profile.goalValues).map((key) => {
									const goalKey = key as Goal;
									return (
										<div
											key={goalKey}
											className="flex items-center justify-between gap-3"
										>
											<label className="text-xs text-zinc-400 capitalize">
												{GOAL_LABELS[goalKey]}
											</label>
											{isEditing ? (
												<input
													type="number"
													step="0.05"
													min="0.5"
													max="1.5"
													value={editForm?.goalValues[goalKey]}
													onChange={(e) =>
														setEditForm((prev) =>
															prev
																? {
																		...prev,
																		goalValues: {
																			...prev.goalValues,
																			[goalKey]: Number(e.target.value),
																		},
																	}
																: null,
														)
													}
													className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-white text-right w-16 focus:outline-none focus:border-blue-500"
												/>
											) : (
												<span className="text-xs font-semibold text-white">
													{profile.goalValues[goalKey]}x
												</span>
											)}
										</div>
									);
								})}
							</div>
						</div>

						{/* Metabolism Algorithm */}
						<div className="p-3">
							<div className="flex items-center gap-2 mb-2">
								<Activity size={16} className="text-purple-500" />
								<p className="text-sm text-zinc-300 font-medium">
									Metabolism Algorithm
								</p>
							</div>
							{!isEditing && (
								<>
									<p className="text-xs font-semibold text-white mb-1">
										{METABOLISM_ALGORITHM_LABELS[profile.metabolismAlgorithm]}
									</p>
									<p className="text-xs text-zinc-400">
										{
											METABOLISM_ALGORITHM_DESCRIPTIONS[
												profile.metabolismAlgorithm
											]
										}
									</p>
								</>
							)}
							{isEditing && (
								<>
									<select
										value={editForm?.metabolismAlgorithm}
										onChange={(e) =>
											setEditForm((prev) =>
												prev
													? {
															...prev,
															metabolismAlgorithm: e.target
																.value as MetabolismAlgorithmType,
														}
													: null,
											)
										}
										className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500 mb-1"
									>
										{Object.values(MetabolismAlgorithm).map((val) => (
											<option key={val} value={val}>
												{
													METABOLISM_ALGORITHM_LABELS[
														val as MetabolismAlgorithmType
													]
												}
											</option>
										))}
									</select>
									<p className="text-xs text-zinc-400">
										{
											METABOLISM_ALGORITHM_DESCRIPTIONS[
												(editForm?.metabolismAlgorithm ||
													profile.metabolismAlgorithm) as MetabolismAlgorithmType
											]
										}
									</p>
								</>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Reset Button - For Testing */}
			<div className="mt-8 pt-6 border-t border-zinc-800">
				<button
					type="button"
					onClick={handleReset}
					className="w-full p-4 bg-red-900/20 border border-red-900/50 rounded-xl text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors flex items-center justify-center gap-2"
				>
					<Trash2 size={20} />
					<span className="font-medium">Reset All Data (Testing)</span>
				</button>
			</div>
		</div>
	);
}
