import { useState } from "react";
import { User, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
		<div className="min-h-screen barbershop-bg flex items-center justify-center px-4">
			<Card className="w-full max-w-md barbershop-card border-barbershop-dark">
				<CardHeader className="text-center">
					<div className="flex justify-center mb-4">
						<div className="w-16 h-16 barbershop-gold rounded-full flex items-center justify-center">
							<img src={logoUrl} alt="Barbershop logo" className="h-10 w-10 rounded-full object-cover" />
						</div>
					</div>
					<CardTitle className="text-2xl text-barbershop-text">{t("login.title")}</CardTitle>
					<p className="text-barbershop-muted">{t("login.subtitle")}</p>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleLogin} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="firstName" className="text-barbershop-text">
								{t("login.firstName.label")}
							</Label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-barbershop-muted h-4 w-4" />
								<Input
									id="firstName"
									type="text"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									placeholder={t("login.firstName.placeholder")}
									className="pl-10 barbershop-dark border-barbershop-charcoal text-barbershop-text"
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="lastName" className="text-barbershop-text">
								{t("login.lastName.label")}
							</Label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-barbershop-muted h-4 w-4" />
								<Input
									id="lastName"
									type="text"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									placeholder={t("login.lastName.placeholder")}
									className="pl-10 barbershop-dark border-barbershop-charcoal text-barbershop-text"
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password" className="text-barbershop-text">
								{t("login.password.label")}
							</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-barbershop-muted h-4 w-4" />
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder={t("login.password.placeholder")}
									className="pl-10 barbershop-dark border-barbershop-charcoal text-barbershop-text"
									required
								/>
							</div>
						</div>

						<Button
							type="submit"
							disabled={isLoading}
							className="w-full barbershop-gold text-white font-semibold py-3 hover:opacity-90 transition-all"
						>
							{isLoading ? t("login.button.loading") : t("login.button.label")}
						</Button>
					</form>

					<div className="mt-6 barbershop-dark rounded-lg p-4">
						<h3 className="text-sm font-medium text-barbershop-text mb-3">{t("login.demo.credentials.title")}</h3>
						<div className="text-xs text-barbershop-muted space-y-2">
							<div className="border-l-2 border-barbershop-gold pl-3">
								<p className="font-medium text-barbershop-text">{t("login.demo.credentials.admin.title")}</p>
								<p>{t("login.demo.credentials.admin.description")}</p>
							</div>
							<div className="border-l-2 border-blue-500 pl-3">
								<p className="font-medium text-barbershop-text">{t("login.demo.credentials.customer.title")}</p>
								<p>{t("login.demo.credentials.customer.description")}</p>
							</div>
						</div>
					</div>

					<div className="mt-6 text-center">
						<p className="text-barbershop-muted text-sm">
							{t("login.no.account.label")}{" "}
							<Link href="/register" className="text-barbershop-gold hover:underline">
								{t("login.no.account.link")}
							</Link>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
