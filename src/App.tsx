import { Routes, Route } from "react-router-dom";
import { useUserStore } from "./store/userStore";
import AppLayout from "./components/layout/AppLayout";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import WorkoutPage from "./pages/WorkoutPage";
import ActivityPage from "./pages/ActivityPage";
import ActiveWorkoutPage from "./pages/ActiveWorkoutPage";

function App() {
	const hasCompletedOnboarding = useUserStore(
		(state) => state.hasCompletedOnboarding,
	);

	if (!hasCompletedOnboarding) {
		return <OnboardingPage />;
	}

	return (
		<Routes>
			<Route path="/" element={<AppLayout />}>
				<Route index element={<DashboardPage />} />
				<Route path="workout" element={<WorkoutPage />} />
				<Route path="workout/active" element={<ActiveWorkoutPage />} />
				<Route path="activity" element={<ActivityPage />} />
			</Route>
		</Routes>
	);
}

export default App;
