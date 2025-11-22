import ProfileForm from "../features/onboarding/ProfileForm";

export default function OnboardingPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
						PureTone
					</h1>
					<p className="text-zinc-400">Your personal fitness architect</p>
				</div>
				<ProfileForm />
			</div>
		</div>
	);
}
