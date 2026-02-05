import { useState } from "react";
import { User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { apiPost } from "@/config/api";

const logoUrl = new URL("../assets/WhatsApp Image 2026-01-28 at 22.36.13.jpeg", import.meta.url).href;

export default function LoginPage() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [, setLocation] = useLocation();
	const { toast } = useToast();
	const { t } = useTranslation();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Call the authentication API
			const response = await apiPost("/auth/login", {
				firstName,
				lastName,
				password,
			});

			const data = await response.json();

			if (response.ok) {
				// Store user info in localStorage
				localStorage.setItem("userRole", data.user.role);
				localStorage.setItem("userEmail", data.user.email);
				localStorage.setItem("userFirstName", data.user.firstName || "");
				localStorage.setItem("userLastName", data.user.lastName || "");
				localStorage.setItem("userPhone", data.user.phone || "");

				// Dispatch auth change event to update other components
				window.dispatchEvent(new Event("auth-change"));

				toast({
					title: t("login.success.title"),
					description: t("login.success.description", { name: data.user.firstName || "" }),
				});

				// Redirect based on role
				if (data.user.role === "admin" || data.user.role === "barber") {
					setLocation("/admin");
				} else {
					setLocation("/");
				}
			} else {
				toast({
					title: t("login.failure.title"),
					description: data.message || t("login.failure.description"),
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Login error:", error);
			toast({
				title: t("login.failure.title"),
				description: t("login.failure.description"),
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-surface-primary to-surface-secondary flex items-center justify-center px-4 py-12">
			<div className="w-full max-w-md">
				<div className="glass-card-heavy rounded-3xl p-8 shadow-glass-lg">
					{/* Header */}
					<div className="text-center mb-8">
						<div className="flex justify-center mb-4">
							<div className="w-20 h-20 rounded-2xl bg-surface-secondary flex items-center justify-center shadow-soft">
								<img src={logoUrl} alt="Barbershop logo" className="h-14 w-14 rounded-xl object-cover" />
							</div>
						</div>
						<h1 className="text-2xl font-semibold text-text-primary">{t("login.title")}</h1>
						<p className="text-text-secondary text-sm mt-1">{t("login.subtitle")}</p>
					</div>

					{/* Form */}
					<form onSubmit={handleLogin} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="firstName" className="text-sm font-medium text-text-primary">
								{t("login.firstName.label")}
							</Label>
							<div className="relative">
								<User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
								<Input
									id="firstName"
									type="text"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									placeholder={t("login.firstName.placeholder")}
									className="pl-11 input-glass rounded-xl h-12"
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="lastName" className="text-sm font-medium text-text-primary">
								{t("login.lastName.label")}
							</Label>
							<div className="relative">
								<User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
								<Input
									id="lastName"
									type="text"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									placeholder={t("login.lastName.placeholder")}
									className="pl-11 input-glass rounded-xl h-12"
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password" className="text-sm font-medium text-text-primary">
								{t("login.password.label")}
							</Label>
							<div className="relative">
								<Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder={t("login.password.placeholder")}
									className="pl-11 input-glass rounded-xl h-12"
									required
								/>
							</div>
						</div>

						<Button
							type="submit"
							disabled={isLoading}
							className="w-full btn-accent py-4 h-auto text-base font-medium rounded-xl mt-2"
						>
							{isLoading ? t("login.button.loading") : t("login.button.label")}
						</Button>
					</form>

					{/* Register link */}
					<div className="mt-6 text-center">
						<p className="text-text-secondary text-sm">
							{t("login.no.account.label")}{" "}
							<Link href="/register" className="text-accent-blue font-medium hover:underline">
								{t("login.no.account.link")}
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
