import { useState } from "react";
import { Scissors, LogIn, LogOut, User } from "lucide-react";
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
  const { isLoggedIn, userEmail, userFirstName, userLastName, logout } = useAuth();
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
    <div className="min-h-screen barbershop-bg text-barbershop-text">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <CalendarComponent
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateSelect={setSelectedDate}
            onTimeSelect={setSelectedTime}
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
