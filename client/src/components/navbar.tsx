import { LogIn, LogOut, User, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./language-switcher";
import { useState } from "react";

const logoUrl = new URL("../assets/WhatsApp Image 2026-01-28 at 22.36.13.jpeg", import.meta.url).href;

export default function Navbar() {
	const [location, setLocation] = useLocation();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
		{ href: "/", label: t("nav.about") },
		{ href: "/booking", label: t("nav.booking") },
		{ href: "/contact", label: t("nav.contact") },
		...(isLoggedIn && (userRole === "admin" || userRole === "barber")
			? [
					{ href: "/admin", label: t("nav.admin") },
					{ href: "/analytics", label: t("nav.analytics") },
			  ]
			: []),
	];

	return (
		<header className="sticky top-0 z-50 glass-nav">
			<div className="max-w-7xl mx-auto px-6">
				<div className="flex justify-between items-center h-16">
					<Link href="/">
						<div className="flex items-center space-x-3 cursor-pointer">
							<img
								src={logoUrl}
								alt="Duo Lab logo"
								className="h-10 w-10 rounded-full object-cover shadow-soft"
							/>
							<h1 className="text-xl font-semibold text-text-primary tracking-tight">Duo Lab</h1>
						</div>
					</Link>
					
					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-8">
						<nav className="flex space-x-6">
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className={`text-sm font-medium transition-colors duration-200 ${
										location === item.href
											? "text-accent-blue"
											: "text-text-secondary hover:text-text-primary"
									}`}
								>
									{item.label}
								</Link>
							))}
						</nav>
						
						<div className="flex items-center space-x-4">
							{isLoggedIn ? (
								<div className="flex items-center gap-4">
									<div className="flex items-center gap-2 text-sm text-text-secondary">
										<div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center">
											<User className="h-4 w-4 text-text-tertiary" />
										</div>
										<span className="font-medium text-text-primary">{getUserDisplayName()}</span>
									</div>
									<Button
										variant="ghost"
										size="sm"
										className="text-text-secondary hover:text-text-primary hover:bg-surface-secondary rounded-full px-4"
										onClick={handleLogout}
									>
										<LogOut className="h-4 w-4 mr-2" />
										{t("nav.logout")}
									</Button>
								</div>
							) : (
								<Link href="/login">
									<Button
										size="sm"
										className="btn-accent text-sm px-5 py-2 h-9"
									>
										<LogIn className="h-4 w-4 mr-2" />
										{t("nav.login")}
									</Button>
								</Link>
							)}
							<LanguageSwitcher />
						</div>
					</div>

					{/* Mobile menu button */}
					<button
						className="md:hidden p-2 rounded-xl hover:bg-surface-secondary transition-colors"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						{mobileMenuOpen ? (
							<X className="h-6 w-6 text-text-primary" />
						) : (
							<Menu className="h-6 w-6 text-text-primary" />
						)}
					</button>
				</div>

				{/* Mobile Navigation */}
				{mobileMenuOpen && (
					<div className="md:hidden py-4 border-t border-border animate-fade-in">
						<nav className="flex flex-col space-y-1">
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setMobileMenuOpen(false)}
									className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
										location === item.href
											? "text-accent-blue bg-blue-50"
											: "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
									}`}
								>
									{item.label}
								</Link>
							))}
						</nav>
						<div className="mt-4 pt-4 border-t border-border px-4 flex items-center justify-between">
							{isLoggedIn ? (
								<Button
									variant="ghost"
									size="sm"
									className="text-text-secondary hover:text-text-primary"
									onClick={handleLogout}
								>
									<LogOut className="h-4 w-4 mr-2" />
									{t("nav.logout")}
								</Button>
							) : (
								<Link href="/login">
									<Button size="sm" className="btn-accent">
										<LogIn className="h-4 w-4 mr-2" />
										{t("nav.login")}
									</Button>
								</Link>
							)}
							<LanguageSwitcher />
						</div>
					</div>
				)}
			</div>
		</header>
	);
}
