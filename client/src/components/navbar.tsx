import { Scissors, LogIn, LogOut, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./language-switcher";

export default function Navbar() {
	const [location, setLocation] = useLocation();
	const { isLoggedIn, userEmail, userRole, userFirstName, userLastName, logout } = useAuth();
	const { toast } = useToast();
	const { t } = useTranslation();

	const handleLogout = () => {
		logout();
		toast({
			title: t("nav.logout"),
			description: t("auth.loginSuccess"),
		});
		setLocation("/");
	};

	const getUserDisplayName = () => {
		if (userFirstName && userLastName) {
			return `${userFirstName} ${userLastName}`;
		} else if (userFirstName) {
			return userFirstName;
		} else if (userEmail) {
			return userEmail;
		} else {
			return "User";
		}
	};

	const navItems = [
		{ href: "/", label: t("nav.booking") },
		{ href: "/about", label: t("nav.about") },
		{ href: "/contact", label: t("nav.contact") },
		...(isLoggedIn && (userRole === "admin" || userRole === "barber")
			? [
					{ href: "/admin", label: t("nav.admin") },
					{ href: "/analytics", label: t("nav.analytics") },
			  ]
			: []),
	];

	return (
		<header className="barbershop-charcoal border-b border-barbershop-dark">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center py-6">
					<div className="flex items-center space-x-3">
						<Scissors className="text-barbershop-gold text-2xl" />
						<h1 className="text-2xl font-bold text-barbershop-text">Barbershop</h1>
					</div>
					<div className="flex items-center space-x-6">
						<nav className="hidden md:flex space-x-8">
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className={
										location === item.href
											? "text-barbershop-gold"
											: "text-barbershop-muted hover:text-barbershop-gold transition-colors"
									}
								>
									{item.label}
								</Link>
							))}
						</nav>
						{isLoggedIn ? (
							<div className="flex items-center gap-3">
								<div className="flex items-center gap-2 text-sm text-barbershop-muted">
									<User className="h-4 w-4" />
									<span>{getUserDisplayName()}</span>
								</div>
								<Button
									variant="outline"
									size="sm"
									className="barbershop-dark border-barbershop-charcoal text-barbershop-text hover:barbershop-charcoal"
									onClick={handleLogout}
								>
									<LogOut className="h-4 w-4 mr-2" />
									{t("nav.logout")}
								</Button>
							</div>
						) : (
							<Link href="/login">
								<Button
									variant="outline"
									size="sm"
									className="barbershop-dark border-barbershop-charcoal text-barbershop-text hover:barbershop-charcoal"
								>
									<LogIn className="h-4 w-4 mr-2" />
									{t("nav.login")}
								</Button>
							</Link>
						)}
						<LanguageSwitcher />
					</div>
				</div>
			</div>
		</header>
	);
}
