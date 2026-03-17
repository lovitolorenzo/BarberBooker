import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, CalendarCheck, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiGet, apiRequest } from "@/config/api";
import { useTranslation } from "react-i18next";
import type { Appointment, InsertAppointment, ServiceConfig } from "@shared/schema";
import { useLocation } from "wouter";

interface BookingFormProps {
	selectedDate: string | null;
	selectedTime: string | null;
	onBookingConfirmed: (booking: Appointment) => void;
}

const bookingSchema = z.object({
	customerPhone: z.string().optional(),
	service: z.string().min(1, "Please select a service"),
	notes: z.string().optional(),
});

const formatPriceLabel = (priceInCents: number) => `€${Math.round(priceInCents / 100)}`;

type BookingFormData = z.infer<typeof bookingSchema>;

export default function BookingForm({ selectedDate, selectedTime, onBookingConfirmed }: BookingFormProps) {
	const [selectedServiceKey, setSelectedServiceKey] = useState<string | null>(null);
	const { toast } = useToast();
	const { userFirstName, userLastName, userRole, userPhone } = useAuth();
	const isAdmin = userRole === 'admin';
	// State per admin che prenota a nome di altri clienti
	const [adminCustomerFirstName, setAdminCustomerFirstName] = useState('');
	const [adminCustomerLastName, setAdminCustomerLastName] = useState('');
	const [adminCustomerPhone, setAdminCustomerPhone] = useState('');
	const queryClient = useQueryClient();
	const { t } = useTranslation();
	const [_, navigate] = useLocation();

	const { data: serviceConfigs = [] } = useQuery<ServiceConfig[]>({
		queryKey: ["/api/services"],
		queryFn: async () => {
			const response = await apiGet("/api/services");
			if (!response.ok) throw new Error("Failed to fetch services");
			return response.json();
		},
	});

	const selectedService = selectedServiceKey
		? serviceConfigs.find((s) => s.key === selectedServiceKey)
		: undefined;

	const getServiceDisplayName = (service: ServiceConfig) => {
		const translationKey = `services.${service.key}`;
		const translated = t(translationKey);
		return translated !== translationKey ? translated : service.name;
	};

	const form = useForm<BookingFormData>({
		resolver: zodResolver(bookingSchema),
		defaultValues: {
			customerPhone: "",
			service: "",
			notes: "",
		},
	});

	const phoneRegex = /^\+?[0-9\s().-]{6,}$/;

	const createAppointmentMutation = useMutation({
		mutationFn: async (data: InsertAppointment) => {
			const response = await apiRequest("POST", "/api/appointments", data);
			if (!response.ok) {
				let message = "";
				try {
					const errorData = await response.json();
					message = errorData?.message || "";
				} catch {
					// ignore
				}
				throw new Error(message || `Request failed: ${response.status} ${response.statusText}`);
			}

			return response.json();
		},
		onSuccess: (appointment: Appointment) => {
			queryClient.invalidateQueries({ queryKey: ["/api/appointments/range"] });
			onBookingConfirmed(appointment);
			form.reset();
			setSelectedServiceKey(null);
			toast({
				title: t("bookingConfirmed.title"),
				description: t("bookingConfirmed.description"),
			});
		},
		onError: (error: any) => {
			toast({
				title: t("bookingFailed.title"),
				description: error.message || t("bookingFailed.description"),
				variant: "destructive",
			});
		},
	});

	const formatDisplayDate = (dateStr: string) => {
		const date = new Date(dateStr + "T00:00:00");
		return date.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const formatTime = (timeStr: string) => {
		const [hours, minutes] = timeStr.split(":");
		const hour = parseInt(hours);
		const ampm = hour >= 12 ? "PM" : "AM";
		const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
		return `${displayHour}:${minutes} ${ampm}`;
	};

	const onSubmit = (data: BookingFormData) => {
		if (!selectedDate || !selectedTime || !selectedServiceKey) {
			toast({
				title: t("missingInformation.title"),
				description: t("missingInformation.description"),
				variant: "destructive",
			});
			return;
		}

		// Per admin: usa i nomi inseriti manualmente, altrimenti usa i dati dell'utente loggato
		const finalFirstName = isAdmin ? adminCustomerFirstName : userFirstName;
		const finalLastName = isAdmin ? adminCustomerLastName : userLastName;
		const finalPhone = isAdmin ? adminCustomerPhone : userPhone;

		if (!finalFirstName || !finalLastName) {
			toast({
				title: isAdmin ? t("missingInformation.title") : t("authenticationRequired.title"),
				description: isAdmin ? t("missingInformation.description") : t("authenticationRequired.description"),
				variant: "destructive",
			});
			return;
		}

		if (!finalPhone || !phoneRegex.test(finalPhone)) {
			toast({
				title: t("missingInformation.title"),
				description: t("booking.phoneRequired"),
				variant: "destructive",
			});
			return;
		}

		const serviceInfo = selectedService;
		if (!serviceInfo) {
			toast({
				title: t("missingInformation.title"),
				description: t("missingInformation.description"),
				variant: "destructive",
			});
			return;
		}

		const serviceDisplayName = getServiceDisplayName(serviceInfo);
		const appointmentData: InsertAppointment = {
			customerFirstName: finalFirstName,
			customerLastName: finalLastName,
			customerPhone: finalPhone,
			serviceKey: serviceInfo.key,
			service: serviceDisplayName,
			notes: data.notes,
			appointmentDate: selectedDate,
			appointmentTime: selectedTime,
			duration: serviceInfo.duration,
			price: serviceInfo.price,
			status: "confirmed",
		};

		createAppointmentMutation.mutate(appointmentData);
	};

	const handleServiceChange = (value: string) => {
		setSelectedServiceKey(value);
		form.setValue("service", value);
	};

	const isFormValid = selectedDate && selectedTime && selectedServiceKey &&
		(isAdmin
			? (adminCustomerFirstName && adminCustomerLastName && adminCustomerPhone)
			: (userFirstName && userLastName && userPhone));

	return (
		<div className="glass-card rounded-3xl p-6 shadow-glass">
			<h2 className="text-xl font-semibold text-text-primary mb-6">{t("bookAppointment")}</h2>

			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
				{/* Service Selection */}
				<div className="space-y-2">
					<Label htmlFor="service" className="text-sm font-medium text-text-primary">
						{t("selectService")}
					</Label>
					<Select value={selectedServiceKey ?? undefined} onValueChange={handleServiceChange}>
						<SelectTrigger className="w-full px-4 py-3 bg-white/60 border border-border rounded-xl text-text-primary focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all">
							<SelectValue
								placeholder={t("chooseService")}
							>
								{selectedService ? `${getServiceDisplayName(selectedService)} - ${selectedService.duration}min - ${formatPriceLabel(selectedService.price)}` : undefined}
							</SelectValue>
						</SelectTrigger>
						<SelectContent className="bg-white border-border rounded-xl shadow-glass">
							{serviceConfigs.map((service) => {
								const title = getServiceDisplayName(service);
								return (
									<SelectItem key={service.key} value={service.key} className="text-text-primary hover:bg-surface-secondary rounded-lg">
										{title} - {service.duration}min - {formatPriceLabel(service.price)}
									</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
					{form.formState.errors.service && (
						<p className="text-accent-red text-sm">{form.formState.errors.service.message}</p>
					)}
				</div>

				{/* Selected Date/Time Display */}
				{selectedDate && selectedTime && (
					<div className="bg-accent-blue/5 rounded-2xl p-4 border border-accent-blue/20">
						<div className="flex items-center gap-2 mb-2">
							<Calendar className="h-4 w-4 text-accent-blue" />
							<span className="text-sm font-medium text-text-primary">{t("selectedAppointment")}</span>
						</div>
						<div className="text-text-secondary text-sm">
							{formatDisplayDate(selectedDate)} at {formatTime(selectedTime)}
						</div>
						{selectedService && (
							<div className="text-xs text-text-secondary mt-1">
								{t("duration")} {selectedService.duration} {t("minutes")}
							</div>
						)}
					</div>
				)}

				{/* Customer Information */}
				{isAdmin ? (
					<div className="space-y-3">
						<Label className="text-sm font-medium text-text-primary">{t("bookingFor")} {t("booking.adminSuffix")}</Label>
						<div className="grid grid-cols-2 gap-3">
							<Input
								type="text"
								placeholder={t("auth.firstName")}
								value={adminCustomerFirstName}
								onChange={(e) => setAdminCustomerFirstName(e.target.value)}
								className="input-glass rounded-xl"
							/>
							<Input
								type="text"
								placeholder={t("auth.lastName")}
								value={adminCustomerLastName}
								onChange={(e) => setAdminCustomerLastName(e.target.value)}
								className="input-glass rounded-xl"
							/>
						</div>
						<div>
							<Input
								type="tel"
								placeholder={t("phoneNumber")}
								value={adminCustomerPhone}
								onChange={(e) => setAdminCustomerPhone(e.target.value)}
								className="input-glass rounded-xl"
							/>
						</div>
					</div>
				) : userFirstName && userLastName ? (
					<div className="space-y-2">
						<Label className="text-sm font-medium text-text-primary">{t("bookingFor")}</Label>
						<div className="w-full px-4 py-3 bg-surface-secondary border border-border rounded-xl text-text-primary">
							{userFirstName} {userLastName}
						</div>
					</div>
				) : (
					<div className="bg-accent-orange/5 border border-accent-orange/20 rounded-2xl p-5 flex flex-col items-center text-center">
						<p className="text-text-secondary text-sm mb-4">{t("authenticationRequired.description")}</p>
						<Button 
							className="btn-accent"
							onClick={() => navigate('/login')}
						>
							<LogIn className="h-4 w-4 mr-2" />
							{t("nav.login")}
						</Button>
					</div>
				)}

				{/* Special Requests */}
				<div className="space-y-2">
					<Label htmlFor="notes" className="text-sm font-medium text-text-primary">
						{t("specialRequests")}
					</Label>
					<Textarea
						{...form.register("notes")}
						rows={3}
						placeholder={t("anySpecificRequests")}
						className="input-glass rounded-xl resize-none"
					/>
				</div>

				{/* Submit Button */}
				<Button
					type="submit"
					disabled={!isFormValid || createAppointmentMutation.isPending}
					className="w-full btn-accent py-4 h-auto text-base font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<CalendarCheck className="mr-2 h-5 w-5" />
					{createAppointmentMutation.isPending ? t("booking") : t("bookAppointment")}
				</Button>
			</form>
		</div>
	);
}
