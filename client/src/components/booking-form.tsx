import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { services, type ServiceKey, type Appointment, type InsertAppointment } from "@shared/schema";

interface BookingFormProps {
  selectedDate: string | null;
  selectedTime: string | null;
  onBookingConfirmed: (booking: Appointment) => void;
}

const bookingSchema = z.object({
  customerPhone: z.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, "Please enter a valid phone number"),
  service: z.string().min(1, "Please select a service"),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function BookingForm({ 
  selectedDate, 
  selectedTime, 
  onBookingConfirmed 
}: BookingFormProps) {
  const [selectedService, setSelectedService] = useState<ServiceKey | null>(null);
  const { toast } = useToast();
  const { userFirstName, userLastName } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerPhone: "",
      service: "",
      notes: "",
    }
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: InsertAppointment) => {
      const response = await apiRequest("POST", "/api/appointments", data);
      return response.json();
    },
    onSuccess: (appointment: Appointment) => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments/range'] });
      onBookingConfirmed(appointment);
      form.reset();
      setSelectedService(null);
      toast({
        title: "Booking Confirmed!",
        description: "Your appointment has been successfully booked.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    }
  });

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const onSubmit = (data: BookingFormData) => {
    if (!selectedDate || !selectedTime || !selectedService) {
      toast({
        title: "Missing Information",
        description: "Please select a date, time, and service.",
        variant: "destructive",
      });
      return;
    }

    if (!userFirstName || !userLastName) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a booking.",
        variant: "destructive",
      });
      return;
    }

    const serviceInfo = services[selectedService];
    const appointmentData: InsertAppointment = {
      customerFirstName: userFirstName,
      customerLastName: userLastName,
      customerPhone: data.customerPhone,
      service: data.service,
      notes: data.notes,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      duration: serviceInfo.duration,
      price: serviceInfo.price * 100, // Convert to cents
      status: "confirmed"
    };

    createAppointmentMutation.mutate(appointmentData);
  };

  const handleServiceChange = (value: string) => {
    setSelectedService(value as ServiceKey);
    form.setValue("service", value);
  };

  const isFormValid = selectedDate && selectedTime && selectedService && userFirstName && userLastName;

  return (
    <Card className="barbershop-card border-barbershop-dark shadow-xl">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-barbershop-text mb-6">Book Your Appointment</h2>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Service Selection */}
          <div className="space-y-2">
            <Label htmlFor="service" className="text-sm font-medium text-barbershop-text">
              Select Service
            </Label>
            <Select onValueChange={handleServiceChange}>
              <SelectTrigger className="w-full px-4 py-3 barbershop-dark border border-barbershop-charcoal rounded-lg text-barbershop-text focus:ring-2 focus:ring-barbershop-gold focus:border-transparent">
                <SelectValue placeholder="Choose a service..." />
              </SelectTrigger>
              <SelectContent className="barbershop-dark border-barbershop-charcoal">
                {Object.entries(services).map(([key, service]) => (
                  <SelectItem 
                    key={key} 
                    value={key}
                    className="text-barbershop-text hover:barbershop-charcoal"
                  >
                    {service.name} - {service.duration}min - ${service.price}
                  </SelectItem>
                ))}
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
                <span className="text-sm font-medium text-barbershop-text">Selected Appointment</span>
              </div>
              <div className="text-barbershop-muted">
                {formatDisplayDate(selectedDate)} at {formatTime(selectedTime)}
              </div>
              {selectedService && (
                <div className="text-sm text-barbershop-muted mt-1">
                  Duration: {services[selectedService].duration} minutes
                </div>
              )}
            </div>
          )}

          {/* Customer Information */}
          {userFirstName && userLastName ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-barbershop-text">
                Booking for
              </Label>
              <div className="w-full px-4 py-3 barbershop-dark border border-barbershop-charcoal rounded-lg text-barbershop-text bg-barbershop-dark">
                {userFirstName} {userLastName}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-full px-4 py-3 border border-red-400 rounded-lg text-red-400 bg-red-50">
                Please log in to make a booking
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-barbershop-text">
              Phone Number
            </Label>
            <Input
              {...form.register("customerPhone")}
              type="tel"
              placeholder="(555) 123-4567"
              className="w-full px-4 py-3 barbershop-dark border border-barbershop-charcoal rounded-lg text-barbershop-text placeholder-barbershop-muted focus:ring-2 focus:ring-barbershop-gold focus:border-transparent"
            />
            {form.formState.errors.customerPhone && (
              <p className="text-red-400 text-sm">{form.formState.errors.customerPhone.message}</p>
            )}
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-barbershop-text">
              Special Requests (Optional)
            </Label>
            <Textarea
              {...form.register("notes")}
              rows={3}
              placeholder="Any specific requests or preferences..."
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
            {createAppointmentMutation.isPending ? "Booking..." : "Book Appointment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
