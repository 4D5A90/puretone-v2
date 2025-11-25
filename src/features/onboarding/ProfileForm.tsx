import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	useUserStore,
	type UserProfile,
	type ActivityLevelType,
	ActivityLevel,
	Goal,
} from "../../store/userStore";
import clsx from "clsx";

export default function ProfileForm() {
	const navigate = useNavigate();
	const setProfile = useUserStore((state) => state.setProfile);
	const setHasCompletedOnboarding = useUserStore(
		(state) => state.setHasCompletedOnboarding,
	);

	const [formData, setFormData] = useState<UserProfile>({
		age: 25,
		height: 175,
		weight: 70,
		gender: "male",
		activityLevel: ActivityLevel.Moderate,
		goal: Goal.Maintain,
		estimatedDailySteps: 10000,
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setProfile(formData);
		setHasCompletedOnboarding(true);
		navigate("/");
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]:
				name === "age" || name === "height" || name === "weight"
					? Number(value)
					: value,
		}));
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-4">
			<h2 className="text-2xl font-bold text-center mb-8">
				Tell us about yourself
			</h2>

			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-zinc-400 mb-1">
						Gender
					</label>
					<div className="grid grid-cols-2 gap-4">
						{["male", "female"].map((g) => (
							<button
								key={g}
								type="button"
								onClick={() =>
									setFormData({
										...formData,
										gender: g as UserProfile["gender"],
									})
								}
								className={clsx(
									"p-3 rounded-lg border capitalize transition-colors",
									formData.gender === g
										? "bg-blue-600 border-blue-500 text-white"
										: "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800",
								)}
							>
								{g}
							</button>
						))}
					</div>
				</div>

				<div className="grid grid-cols-3 gap-4">
					<div>
						<label
							htmlFor="age"
							className="block text-sm font-medium text-zinc-400 mb-1"
						>
							Age
						</label>
						<input
							id="age"
							type="number"
							name="age"
							value={formData.age}
							onChange={handleChange}
							className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
						/>
					</div>
					<div>
						<label
							htmlFor="height"
							className="block text-sm font-medium text-zinc-400 mb-1"
						>
							Height (cm)
						</label>
						<input
							id="height"
							type="number"
							name="height"
							value={formData.height}
							onChange={handleChange}
							className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
						/>
					</div>
					<div>
						<label
							htmlFor="weight"
							className="block text-sm font-medium text-zinc-400 mb-1"
						>
							Weight (kg)
						</label>
						<input
							id="weight"
							type="number"
							name="weight"
							value={formData.weight}
							onChange={handleChange}
							className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
						/>
					</div>
				</div>

				<div>
					<label
						htmlFor="activityLevel"
						className="block text-sm font-medium text-zinc-400 mb-1"
					>
						Activity Level
					</label>
					<select
						id="activityLevel"
						name="activityLevel"
						value={formData.activityLevel}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								activityLevel: Number(e.target.value) as ActivityLevelType,
							}))
						}
						className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
					>
						<option value={ActivityLevel.Sedentary}>
							Sedentary (Office job, little exercise)
						</option>
						<option value={ActivityLevel.Light}>
							Light (Exercise 1-3 days/week)
						</option>
						<option value={ActivityLevel.Moderate}>
							Moderate (Exercise 3-5 days/week)
						</option>
						<option value={ActivityLevel.Active}>
							Active (Exercise 6-7 days/week)
						</option>
						<option value={ActivityLevel.VeryActive}>
							Very Active (Physical job + exercise)
						</option>
					</select>
				</div>

				<div>
					<label
						htmlFor="estimatedDailySteps"
						className="block text-sm font-medium text-zinc-400 mb-1"
					>
						Estimated Daily Steps
					</label>
					<input
						id="estimatedDailySteps"
						type="number"
						name="estimatedDailySteps"
						value={formData.estimatedDailySteps}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								estimatedDailySteps: Number(e.target.value),
							}))
						}
						min="0"
						step="1000"
						className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
					/>
					<p className="text-xs text-zinc-500 mt-1">
						Your typical daily step count (used for TDEE calculation)
					</p>
				</div>

				<div>
					<label className="block text-sm font-medium text-zinc-400 mb-1">
						Goal
					</label>
					<div className="grid grid-cols-3 gap-2">
						{[
							{ value: Goal.Cut, label: "Lose Fat" },
							{ value: Goal.Maintain, label: "Maintain" },
							{ value: Goal.Bulk, label: "Build Muscle" },
						].map((option) => (
							<button
								key={option.value}
								type="button"
								onClick={() =>
									setFormData({
										...formData,
										goal: option.value,
									})
								}
								className={clsx(
									"p-3 rounded-lg border text-sm transition-colors",
									formData.goal === option.value
										? "bg-blue-600 border-blue-500 text-white"
										: "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800",
								)}
							>
								{option.label}
							</button>
						))}
					</div>
				</div>
			</div>

			<button
				type="submit"
				className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-colors mt-8"
			>
				Create Plan
			</button>
		</form>
	);
}
