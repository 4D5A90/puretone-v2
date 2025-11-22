import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { WorkoutPlan } from "../features/workout/WorkoutGenerator";
import { Clock } from "lucide-react";
import { storage } from "../services/storage/LocalStorageAdapter";
import { WorkoutRepository } from "../services/storage/WorkoutRepository";

const workoutRepo = new WorkoutRepository(storage);

export default function ActiveWorkoutPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const workout = location.state?.workout as WorkoutPlan;

	const [elapsedTime, setElapsedTime] = useState(0);
	const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
	const [currentSet, setCurrentSet] = useState(1);
	const [isResting, setIsResting] = useState(false);
	const [restTimer, setRestTimer] = useState(0);
	const [weight, setWeight] = useState("");
	const [reps, setReps] = useState("");
	const [isFinished, setIsFinished] = useState(false);

	useEffect(() => {
		if (!workout) {
			navigate("/workout");
			return;
		}

		const timer = setInterval(() => {
			setElapsedTime((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [workout, navigate]);

	useEffect(() => {
		let timer: ReturnType<typeof setInterval>;
		if (isResting && restTimer > 0) {
			timer = setInterval(() => {
				setRestTimer((prev) => prev - 1);
			}, 1000);
		} else if (isResting && restTimer === 0) {
			setIsResting(false);
		}
		return () => clearInterval(timer);
	}, [isResting, restTimer]);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const handleNextSet = () => {
		const currentExercise = workout.exercises[currentExerciseIndex];

		// Logic to move to next set or next exercise
		if (currentSet < currentExercise.sets) {
			setCurrentSet((prev) => prev + 1);
			setRestTimer(currentExercise.rest);
			setIsResting(true);
		} else if (currentExerciseIndex < workout.exercises.length - 1) {
			setCurrentExerciseIndex((prev) => prev + 1);
			setCurrentSet(1);
			setRestTimer(currentExercise.rest);
			setIsResting(true);
		} else {
			handleFinish();
		}

		// Reset inputs
		setWeight("");
		setReps("");
	};

	const handleFinish = async () => {
		setIsFinished(true);
		await workoutRepo.saveWorkout({
			...workout,
			date: new Date().toISOString(),
			durationSeconds: elapsedTime,
		});
		setTimeout(() => navigate("/"), 1000);
	};

	if (!workout) return null;

	return (
		<div className="pb-20">
			<header className="mb-6 sticky top-0 bg-zinc-950/80 backdrop-blur py-4 z-10 border-b border-zinc-800">
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-xl font-bold">{workout.name}</h1>
						<div className="flex items-center gap-2 text-blue-500 text-sm font-mono">
							<Clock size={16} />
							{formatTime(elapsedTime)}
						</div>
					</div>
					<button
						type="button"
						onClick={handleFinish}
						disabled={isFinished}
						className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold"
					>
						Finish
					</button>
				</div>
			</header>

			<div className="flex flex-col h-[calc(100vh-140px)] justify-between">
				{isResting ? (
					<div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
						<h2 className="text-3xl font-bold text-blue-500">Rest Time</h2>
						<div className="text-6xl font-mono font-bold">{restTimer}s</div>
						<p className="text-zinc-400">Next: Set {currentSet}</p>
						<button
							type="button"
							onClick={() => setIsResting(false)}
							className="bg-zinc-800 text-white px-6 py-3 rounded-xl mt-4"
						>
							Skip Rest
						</button>
					</div>
				) : (
					<>
						<div className="space-y-6">
							<div className="text-center">
								<h2 className="text-2xl font-bold mb-2">
									{workout.exercises[currentExerciseIndex].exercise.name}
								</h2>
								<p className="text-zinc-400">
									Set{" "}
									<span className="text-white font-bold text-xl">
										{currentSet}
									</span>{" "}
									of {workout.exercises[currentExerciseIndex].sets}
								</p>
							</div>

							<div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-6">
								<div>
									<label
										htmlFor="weight-input"
										className="block text-sm font-medium text-zinc-400 mb-2"
									>
										Weight (kg)
									</label>
									<input
										id="weight-input"
										type="number"
										value={weight}
										onChange={(e) => setWeight(e.target.value)}
										placeholder="0"
										className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-2xl font-bold text-center outline-none focus:border-blue-500"
									/>
								</div>
								<div>
									<label
										htmlFor="reps-input"
										className="block text-sm font-medium text-zinc-400 mb-2"
									>
										Reps
									</label>
									<input
										id="reps-input"
										type="number"
										value={reps}
										onChange={(e) => setReps(e.target.value)}
										placeholder={workout.exercises[currentExerciseIndex].reps}
										className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-2xl font-bold text-center outline-none focus:border-blue-500"
									/>
								</div>
							</div>
						</div>

						<button
							type="button"
							onClick={handleNextSet}
							className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 rounded-2xl text-xl transition-colors"
						>
							{currentSet === workout.exercises[currentExerciseIndex].sets &&
							currentExerciseIndex === workout.exercises.length - 1
								? "Finish Workout"
								: "Next Set"}
						</button>
					</>
				)}
			</div>
		</div>
	);
}
