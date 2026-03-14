import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";

// Use React.lazy for code splitting
const BookingPage = lazy(() => import("@/pages/booking"));
const HomePage = lazy(() => import("@/pages/home"));
const ContactPage = lazy(() => import("@/pages/contact"));
const AdminPage = lazy(() => import("@/pages/admin"));
const AnalyticsPage = lazy(() => import("@/pages/analytics"));
const LoginPage = lazy(() => import("@/pages/login"));
const RegisterPage = lazy(() => import("@/pages/register"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Loading component to show while chunks are loading
const LoadingFallback = () => {
	const { t } = useTranslation();
	return (
		<div className="flex flex-col items-center justify-center h-screen bg-barbershop-dark bg-opacity-80">
			<div className="w-10 h-10 border-4 border-barbershop-gold border-solid rounded-full border-t-transparent animate-spin mb-4"></div>
			<div className="text-barbershop-gold text-xl font-semibold">{t("common.loadingExperience")}</div>
		</div>
	);
};

function Router() {
	return (
		<Suspense fallback={<LoadingFallback />}>
			<Switch>
				<Route path="/" component={HomePage} />
				<Route path="/booking" component={BookingPage} />
				<Route path="/contact" component={ContactPage} />
				<Route path="/admin" component={AdminPage} />
				<Route path="/analytics" component={AnalyticsPage} />
				<Route path="/login" component={LoginPage} />
				<Route path="/register" component={RegisterPage} />
				<Route component={NotFound} />
			</Switch>
		</Suspense>
	);
}

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<TooltipProvider>
				<div className="min-h-screen barbershop-bg">
					<Toaster />
					<Router />
				</div>
			</TooltipProvider>
		</QueryClientProvider>
	);
}

export default App;
