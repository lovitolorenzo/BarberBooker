import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { Scissors, User, Lock } from "lucide-react";
import { useLocation, Link } from "wouter";

export default function RegisterPage() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [, setLocation] = useLocation();
	const { toast } = useToast();
	const { t } = useTranslation();

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Validation
		if (!firstName || !lastName || !password) {
			toast({
				title: t("register.failed"),
				description: t("register.fillAllFields"),
				variant: "destructive",
			});
			setIsLoading(false);
			return;
		}

		if (password !== confirmPassword) {
			toast({
				title: t("register.failed"),
				description: t("register.passwordMismatch"),
				variant: "destructive",
			});
			setIsLoading(false);
			return;
		}

		if (password.length < 6) {
			toast({
				title: t("register.failed"),
				description: t("register.passwordLength"),
				variant: "destructive",
			});
			setIsLoading(false);
			return;
		}

		try {
			// Call the registration API
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					firstName,
					lastName,
					password,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				toast({
					title: t("register.successful"),
					description: t("register.welcomeMessage", { name: firstName }),
				});

				// Redirect to login page
				setLocation("/login");
			} else {
				toast({
					title: t("register.failed"),
					description: data.message || t("register.defaultError"),
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Registration error:", error);
			toast({
				title: t("register.failed"),
				description: t("register.networkError"),
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
							<Scissors className="text-white h-8 w-8" />
						</div>
					</div>
					<CardTitle className="text-2xl text-barbershop-text">Barbershop</CardTitle>
					<p className="text-barbershop-muted">{t("register.createAccount")}</p>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleRegister} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="firstName" className="text-barbershop-text">
								{t("register.firstName")}
							</Label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-barbershop-muted h-4 w-4" />
								<Input
									id="firstName"
									type="text"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									placeholder={t("register.firstNamePlaceholder")}
									className="pl-10 barbershop-dark border-barbershop-charcoal text-barbershop-text"
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="lastName" className="text-barbershop-text">
								{t("register.lastName")}
							</Label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-barbershop-muted h-4 w-4" />
								<Input
									id="lastName"
									type="text"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									placeholder={t("register.lastNamePlaceholder")}
									className="pl-10 barbershop-dark border-barbershop-charcoal text-barbershop-text"
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password" className="text-barbershop-text">
								{t("register.password")}
							</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-barbershop-muted h-4 w-4" />
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder={t("register.passwordPlaceholder")}
									className="pl-10 barbershop-dark border-barbershop-charcoal text-barbershop-text"
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword" className="text-barbershop-text">
								{t("register.confirmPassword")}
							</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-barbershop-muted h-4 w-4" />
								<Input
									id="confirmPassword"
									type="password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder={t("register.confirmPasswordPlaceholder")}
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
							{isLoading ? t("register.creating") : t("register.createAccountButton")}
						</Button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-barbershop-muted text-sm">
							{t("register.alreadyHaveAccount")}{" "}
							<Link href="/login" className="text-barbershop-gold hover:underline">
								{t("register.signInHere")}
							</Link>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
