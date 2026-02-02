import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { apiRequest } from "@/config/api";
import { useTranslation } from "react-i18next";
import { services, type ServiceKey, type Appointment, type InsertAppointment } from "@shared/schema";
import { useLocation } from "wouter";

interface BookingFormProps {
	selectedDate: string | null;
	selectedTime: string | null;
	onBookingConfirmed: (booking: Appointment) => void;
}

const bookingSchema = z.object({
	customerPhone: z
		.string()
		.regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, "Please enter a valid phone number"),
	service: z.string().min(1, "Please select a service"),
	notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function BookingForm({ selectedDate, selectedTime, onBookingConfirmed }: BookingFormProps) {
	const [selectedService, setSelectedService] = useState<ServiceKey | null>(null);
	const { toast } = useToast();
	const { userFirstName, userLastName, userRole } = useAuth();
	const isAdmin = userRole === 'admin';
	// State per admin che prenota a nome di altri clienti
	const [adminCustomerFirstName, setAdminCustomerFirstName] = useState('');
	const [adminCustomerLastName, setAdminCustomerLastName] = useState('');
	const queryClient = useQueryClient();
	const { t } = useTranslation();
	const [_, navigate] = useLocation();

	const form = useForm<BookingFormData>({
		resolver: zodResolver(bookingSchema),
		defaultValues: {
			customerPhone: "",
			service: "",
			notes: "",
		},
	});

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
			setSelectedService(null);
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
		if (!selectedDate || !selectedTime || !selectedService) {
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

		if (!finalFirstName || !finalLastName) {
			toast({
				title: isAdmin ? t("missingInformation.title") : t("authenticationRequired.title"),
				description: isAdmin ? t("missingInformation.description") : t("authenticationRequired.description"),
				variant: "destructive",
			});
			return;
		}

		const serviceInfo = services[selectedService];
		// Usa il nome del servizio dalla traduzione invece del nome hardcoded
		// Usa le chiavi dirette dalla traduzione
		let serviceDisplayName = '';
		if (selectedService === 'haircut') serviceDisplayName = t('services.haircut');
		else if (selectedService === 'beard') serviceDisplayName = t('services.beard');
		else if (selectedService === 'full') serviceDisplayName = t('services.fullservice');
		const appointmentData: InsertAppointment = {
			customerFirstName: finalFirstName,
			customerLastName: finalLastName,
			customerPhone: data.customerPhone,
			service: serviceDisplayName,
			notes: data.notes,
			appointmentDate: selectedDate,
			appointmentTime: selectedTime,
			duration: serviceInfo.duration,
			price: serviceInfo.price * 100, // Convert to cents
			status: "confirmed",
		};

		createAppointmentMutation.mutate(appointmentData);
	};

	const handleServiceChange = (value: string) => {
		setSelectedService(value as ServiceKey);
		form.setValue("service", value);
	};

	const isFormValid = selectedDate && selectedTime && selectedService && 
		(isAdmin ? (adminCustomerFirstName && adminCustomerLastName) : (userFirstName && userLastName));

	return (
		<Card className="barbershop-card border-barbershop-dark shadow-xl">
			<CardContent className="p-6">
				<h2 className="text-xl font-semibold text-barbershop-text mb-6">{t("bookAppointment")}</h2>

				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					{/* Service Selection */}
					<div className="space-y-2">
						<Label htmlFor="service" className="text-sm font-medium text-barbershop-text">
							{t("selectService")}
						</Label>
						<Select onValueChange={handleServiceChange}>
							<SelectTrigger className="w-full px-4 py-3 barbershop-dark border border-barbershop-charcoal rounded-lg text-barbershop-text focus:ring-2 focus:ring-barbershop-gold focus:border-transparent">
								<SelectValue placeholder={t("chooseService")} />
							</SelectTrigger>
							<SelectContent className="barbershop-dark border-barbershop-charcoal">
								{Object.entries(services).map(([key, service]) => {
									// Usa le chiavi dirette dalla traduzione
									let serviceName = '';
									if (key === 'haircut') serviceName = t('services.haircut');
									else if (key === 'beard') serviceName = t('services.beard');
									else if (key === 'full') serviceName = t('services.fullservice');
									return (
										<SelectItem key={key} value={key} className="text-barbershop-text hover:barbershop-charcoal">
											{serviceName} - {service.duration}min - €{service.price}
										</SelectItem>
									);
								})}
							</SelectContent>
						</Select>
						{form.formState.errors.service && (
							<p className="text-red-400 text-sm">{form.formState.errors.service.message}</p>
						)}
					</div>

					{/* Selected Date/Time Display */}
					{selectedDate && selectedTime && (
						<div className="barbershop-dark rounded-lg p-4 border border-barbershop-charcoal">
							<div className="flex items-center space-x-2 mb-2">
								<Calendar className="h-4 w-4 text-barbershop-gold" />
								<span className="text-sm font-medium text-barbershop-text">{t("selectedAppointment")}</span>
							</div>
							<div className="text-barbershop-muted">
								{formatDisplayDate(selectedDate)} at {formatTime(selectedTime)}
							</div>
							{selectedService && (
								<div className="text-sm text-barbershop-muted mt-1">
									{t("duration")} {services[selectedService].duration} {t("minutes")}
								</div>
							)}
						</div>
					)}

					{/* Customer Information */}
					{isAdmin ? (
						/* Admin: campi per inserire nome cliente */
						<div className="space-y-4">
							<Label className="text-sm font-medium text-barbershop-text">{t("bookingFor")} (Admin)</Label>
							<div className="grid grid-cols-2 gap-3">
								<Input
									type="text"
									placeholder={t("firstName")}
									value={adminCustomerFirstName}
									onChange={(e) => setAdminCustomerFirstName(e.target.value)}
									className="w-full px-4 py-3 barbershop-dark border border-barbershop-charcoal rounded-lg text-barbershop-text placeholder-barbershop-muted focus:ring-2 focus:ring-barbershop-gold focus:border-transparent"
								/>
								<Input
									type="text"
									placeholder={t("lastName")}
									value={adminCustomerLastName}
									onChange={(e) => setAdminCustomerLastName(e.target.value)}
									className="w-full px-4 py-3 barbershop-dark border border-barbershop-charcoal rounded-lg text-barbershop-text placeholder-barbershop-muted focus:ring-2 focus:ring-barbershop-gold focus:border-transparent"
								/>
							</div>
						</div>
					) : userFirstName && userLastName ? (
						<div className="space-y-2">
							<Label className="text-sm font-medium text-barbershop-text">{t("bookingFor")}</Label>
							<div className="w-full px-4 py-3 barbershop-dark border border-barbershop-charcoal rounded-lg text-barbershop-text bg-barbershop-dark">
								{userFirstName} {userLastName}
							</div>
						</div>
					) : (
						<div className="space-y-2">
							<div className="w-full p-4 border border-barbershop-charcoal rounded-lg barbershop-dark flex flex-col items-center">
								<p className="text-barbershop-text mb-3">{t("authenticationRequired.description")}</p>
								<Button 
									className="barbershop-gold text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-all"
									onClick={() => navigate('/login')}
								>
									<LogIn className="h-4 w-4 mr-2" />
									{t("nav.login")}
								</Button>
							</div>
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor="phone" className="text-sm font-medium text-barbershop-text">
							{t("phoneNumber")}
						</Label>
						<Input
							{...form.register("customerPhone")}
							type="tel"
							placeholder="(+39) 1234567"
							className="w-full px-4 py-3 barbershop-dark border border-barbershop-charcoal rounded-lg text-barbershop-text placeholder-barbershop-muted focus:ring-2 focus:ring-barbershop-gold focus:border-transparent"
						/>
						{form.formState.errors.customerPhone && (
							<p className="text-red-400 text-sm">{form.formState.errors.customerPhone.message}</p>
						)}
					</div>

					{/* Special Requests */}
					<div className="space-y-2">
						<Label htmlFor="notes" className="text-sm font-medium text-barbershop-text">
							{t("specialRequests")}
						</Label>
						<Textarea
							{...form.register("notes")}
							rows={3}
							placeholder={t("anySpecificRequests")}
							className="w-full px-4 py-3 barbershop-dark border border-barbershop-charcoal rounded-lg text-barbershop-text placeholder-barbershop-muted focus:ring-2 focus:ring-barbershop-gold focus:border-transparent resize-none"
						/>
					</div>

					{/* Submit Button */}
					<Button
						type="submit"
						disabled={!isFormValid || createAppointmentMutation.isPending}
						className="w-full barbershop-gold text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 focus:ring-2 focus:ring-barbershop-gold focus:ring-offset-2 focus:ring-offset-barbershop-card transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<CalendarCheck className="mr-2 h-4 w-4" />
						{createAppointmentMutation.isPending ? t("booking") : t("bookAppointment")}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
