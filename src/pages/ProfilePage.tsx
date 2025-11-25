import { useState } from "react";
import {
	useUserStore,
	type UserProfile,
	type ActivityLevelType,
	type GoalType,
	ActivityLevel,
	Goal,
} from "../store/userStore";
import {
	User,
	Ruler,
	Weight,
	Activity,
	Target,
	Calendar,
	Pencil,
	Save,
	X,
	Trash2,
	Footprints,
} from "lucide-react";
import clsx from "clsx";

const ACTIVITY_LABELS: Record<ActivityLevelType, string> = {
	[ActivityLevel.Sedentary]: "Sedentary",
	[ActivityLevel.Light]: "Light",
	[ActivityLevel.Moderate]: "Moderate",
	[ActivityLevel.Active]: "Active",
	[ActivityLevel.VeryActive]: "Very Active",
};

const GOAL_LABELS: Record<GoalType, string> = {
	[Goal.Cut]: "Cut",
	[Goal.Maintain]: "Maintain",
	[Goal.Bulk]: "Bulk",
};

export default function ProfilePage() {
	const userStore = useUserStore();
	const profile = userStore.profile;
	const [isEditing, setIsEditing] = useState(false);
	const [editForm, setEditForm] = useState<UserProfile | null>(null);

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
			options: Object.values(Goal).map((val) => ({
				value: val,
				label: GOAL_LABELS[val as GoalType],
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
			<div className="grid grid-cols-2 gap-4">
				{items.map((item) => (
					<div
						key={item.label}
						className={clsx(
							"p-4 rounded-xl border flex flex-col gap-3 relative",
							item.bg,
						)}
					>
						<div className={clsx("p-2 rounded-lg w-fit", "bg-zinc-900/50")}>
							<item.icon size={20} className={item.color} />
						</div>
						<div className="flex-1 flex flex-col justify-end">
							<p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">
								{item.label}
							</p>
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
										className="w-full bg-zinc-900/80 border border-zinc-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
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
										className="w-full bg-zinc-900/80 border border-zinc-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
									/>
								)
							) : (
								<p className="text-lg font-bold text-white">{item.value}</p>
							)}
						</div>
					</div>
				))}
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
