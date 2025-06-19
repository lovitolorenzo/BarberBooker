import { useState } from "react";
import { Scissors, LogIn, LogOut, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import CalendarComponent from "@/components/calendar";
import BookingForm from "@/components/booking-form";
import ConfirmationModal from "@/components/confirmation-modal";
import type { Appointment } from "@shared/schema";

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  return (
    <div className="min-h-screen barbershop-bg text-barbershop-text">
      {/* Header */}
      <header className="barbershop-charcoal border-b border-barbershop-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Scissors className="text-barbershop-gold text-2xl" />
              <h1 className="text-2xl font-bold text-barbershop-text">Elite Barbershop</h1>
            </div>
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-8">
                <span className="text-barbershop-gold">Book Now</span>
                <Link href="/about" className="text-barbershop-muted hover:text-barbershop-gold transition-colors">About</Link>
                <Link href="/contact" className="text-barbershop-muted hover:text-barbershop-gold transition-colors">Contact</Link>
                <Link href="/admin" className="text-barbershop-muted hover:text-barbershop-gold transition-colors">Admin</Link>
                <Link href="/analytics" className="text-barbershop-muted hover:text-barbershop-gold transition-colors">Analytics</Link>
              </nav>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="barbershop-dark border-barbershop-charcoal text-barbershop-text hover:barbershop-charcoal"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

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
