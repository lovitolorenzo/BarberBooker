import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import CalendarComponent from "@/components/calendar";
import BookingForm from "@/components/booking-form";
import ConfirmationModal from "@/components/confirmation-modal";
import Navbar from "@/components/navbar";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import type { Appointment } from "@shared/schema";

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [, setLocation] = useLocation();
  const { isLoggedIn, userEmail, userFirstName, userLastName, userRole, logout } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleBookingConfirmed = (booking: Appointment) => {
    setConfirmedBooking(booking);
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setConfirmedBooking(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-primary to-surface-secondary">
      <Navbar />

      {/* Main Content */}
      <main className="container-wide py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">{t('booking.title') || 'Prenota Appuntamento'}</h1>
          <p className="text-text-secondary">{t('booking.subtitle') || 'Seleziona data e ora per il tuo appuntamento'}</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <CalendarComponent
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateSelect={setSelectedDate}
            onTimeSelect={setSelectedTime}
            isAdmin={userRole === 'admin'}
          />
          
          <BookingForm
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onBookingConfirmed={handleBookingConfirmed}
          />
        </div>
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        booking={confirmedBooking}
        onClose={handleCloseConfirmation}
      />
    </div>
  );
}
