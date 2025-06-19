import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import type { Appointment } from "@shared/schema";
import { services, type ServiceKey } from "@shared/schema";
import AddToCalendar from "./add-to-calendar";

interface ConfirmationModalProps {
  isOpen: boolean;
  booking: Appointment | null;
  onClose: () => void;
}

export default function ConfirmationModal({ 
  isOpen, 
  booking, 
  onClose 
}: ConfirmationModalProps) {
  if (!booking) return null;

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getServiceName = (serviceKey: string) => {
    return services[serviceKey as ServiceKey]?.name || serviceKey;
  };

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(0)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="barbershop-card border-barbershop-dark shadow-2xl max-w-md">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-white text-2xl h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold text-barbershop-text mb-2">
            Booking Confirmed!
          </h3>
          <p className="text-barbershop-muted mb-6">
            Your appointment has been successfully booked.
          </p>
          
          <div className="barbershop-dark rounded-lg p-4 mb-6 text-left">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-barbershop-muted">Service:</span>
                <span className="text-barbershop-text">{getServiceName(booking.service)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-barbershop-muted">Date:</span>
                <span className="text-barbershop-text">{formatDisplayDate(booking.appointmentDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-barbershop-muted">Time:</span>
                <span className="text-barbershop-text">{formatTime(booking.appointmentTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-barbershop-muted">Customer:</span>
                <span className="text-barbershop-text">
                  {booking.customerFirstName} {booking.customerLastName}
                </span>
              </div>
              <div className="flex justify-between border-t border-barbershop-charcoal pt-2 mt-2">
                <span className="text-barbershop-muted">Total:</span>
                <span className="text-barbershop-gold font-semibold">
                  {formatPrice(booking.price)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 barbershop-dark text-barbershop-text border-barbershop-charcoal hover:barbershop-charcoal transition-colors"
            >
              Close
            </Button>
            <AddToCalendar booking={booking} className="flex-1" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
