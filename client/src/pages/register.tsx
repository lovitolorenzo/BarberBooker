import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import { useTranslation } from "react-i18next";
import { apiPost } from "@/config/api";
import { User, Lock, Phone } from "lucide-react";

const logoUrl = new URL("../assets/WhatsApp Image 2026-01-28 at 22.36.13.jpeg", import.meta.url).href;

export default function RegisterPage() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [, setLocation] = useLocation();
	const { toast } = useToast();
	const { t } = useTranslation();
	const phoneRegex = /^\+?[0-9\s().-]{6,}$/;

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Validation
		if (!firstName || !lastName || !phone || !password) {
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

		if (!phoneRegex.test(phone)) {
			toast({
				title: t("register.failed"),
				description: t("register.phoneInvalid"),
				variant: "destructive",
			});
			setIsLoading(false);
			return;
		}

		try {
			// Call the registration API
			const response = await apiPost("/auth/register", {
				firstName,
				lastName,
				phone,
				password,
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
		<div className="min-h-screen bg-gradient-to-b from-surface-primary to-surface-secondary flex items-center justify-center px-4 py-12">
			<div className="w-full max-w-md">
				<div className="glass-card-heavy rounded-3xl p-8 shadow-glass-lg">
					{/* Header */}
					<div className="text-center mb-8">
						<div className="flex justify-center mb-4">
							<div className="w-20 h-20 rounded-2xl bg-surface-secondary flex items-center justify-center shadow-soft">
								<img src={logoUrl} alt="Duo Lab logo" className="h-14 w-14 rounded-xl object-cover" />
							</div>
						</div>
						<h1 className="text-2xl font-semibold text-text-primary">Duo Lab</h1>
						<p className="text-text-secondary text-sm mt-1">{t("register.createAccount")}</p>
					</div>

					{/* Form */}
					<form onSubmit={handleRegister} className="space-y-4">
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-2">
								<Label htmlFor="firstName" className="text-sm font-medium text-text-primary">
									{t("register.firstName")}
								</Label>
								<div className="relative">
									<User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
									<Input
										id="firstName"
										type="text"
										value={firstName}
										onChange={(e) => setFirstName(e.target.value)}
										placeholder={t("register.firstNamePlaceholder")}
										className="pl-11 input-glass rounded-xl h-12"
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="lastName" className="text-sm font-medium text-text-primary">
									{t("register.lastName")}
								</Label>
								<div className="relative">
									<User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
									<Input
										id="lastName"
										type="text"
										value={lastName}
										onChange={(e) => setLastName(e.target.value)}
										placeholder={t("register.lastNamePlaceholder")}
										className="pl-11 input-glass rounded-xl h-12"
										required
									/>
								</div>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="phone" className="text-sm font-medium text-text-primary">
								{t("register.phone")}
							</Label>
							<div className="relative">
								<Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
								<Input
									id="phone"
									type="tel"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									placeholder={t("register.phonePlaceholder")}
									className="pl-11 input-glass rounded-xl h-12"
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password" className="text-sm font-medium text-text-primary">
								{t("register.password")}
							</Label>
							<div className="relative">
								<Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder={t("register.passwordPlaceholder")}
									className="pl-11 input-glass rounded-xl h-12"
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword" className="text-sm font-medium text-text-primary">
								{t("register.confirmPassword")}
							</Label>
							<div className="relative">
								<Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
								<Input
									id="confirmPassword"
									type="password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder={t("register.confirmPasswordPlaceholder")}
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
							{isLoading ? t("register.creating") : t("register.createAccountButton")}
						</Button>
					</form>

					{/* Login link */}
					<div className="mt-6 text-center">
						<p className="text-text-secondary text-sm">
							{t("register.alreadyHaveAccount")}{" "}
							<Link href="/login" className="text-accent-blue font-medium hover:underline">
								{t("register.signInHere")}
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
