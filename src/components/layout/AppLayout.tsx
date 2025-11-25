import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, Dumbbell, Activity, User } from "lucide-react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

export default function AppLayout() {
	const location = useLocation();

	const navItems = [
		{ path: "/", icon: Home, label: "Home" },
		{ path: "/workout", icon: Dumbbell, label: "Workout" },
		{ path: "/activity", icon: Activity, label: "Activity" },
		{ path: "/profile", icon: User, label: "Profile" },
	];

	return (
		<div className="min-h-screen bg-zinc-950 text-white pb-20 overflow-hidden">
			<main className="p-4 h-full">
				<AnimatePresence mode="wait">
					<motion.div
						key={location.pathname}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.2 }}
						className="h-full"
					>
						<Outlet />
					</motion.div>
				</AnimatePresence>
			</main>

			<nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 pb-safe">
				<div className="flex justify-around items-center h-16">
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive = location.pathname === item.path;
						return (
							<Link
								key={item.path}
								to={item.path}
								className={clsx(
									"flex flex-col items-center justify-center w-full h-full transition-colors",
									isActive
										? "text-blue-500"
										: "text-zinc-500 hover:text-zinc-300",
								)}
							>
								<Icon size={24} />
								<span className="text-xs mt-1">{item.label}</span>
							</Link>
						);
					})}
				</div>
			</nav>
		</div>
	);
}
