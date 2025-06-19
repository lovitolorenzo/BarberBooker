import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation();

  if (!booking) return null;

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const locale = i18n.language === 'it' ? 'it-IT' : 'en-US';
    
    if (i18n.language === 'it') {
      // Custom Italian formatting
      const day = date.getDate();
      const month = t(`months.${date.toLocaleDateString('en-US', { month: 'long' }).toLowerCase()}`);
      const year = date.getFullYear();
      const dayName = t(`daysFull.${date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()}`);
      return `${dayName}, ${day} ${month} ${year}`;
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    
    if (i18n.language === 'it') {
      // Use 24-hour format for Italian
      return `${hours}:${minutes}`;
    } else {
      // Use 12-hour format for English
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    }
  };

  const getServiceName = (serviceKey: string) => {
    // Use translations for service names
    const translations: { [key: string]: string } = {
      'haircut': t('haircut'),
      'beard': t('beard'),
      'full': t('styling'),
      'shave': t('shave'),
      'wash': t('wash')
    };
    return translations[serviceKey] || serviceKey;
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
            {t('confirmation.title')}
          </h3>
          <p className="text-barbershop-muted mb-6">
            {t('confirmation.description')}
          </p>
          
          <div className="barbershop-dark rounded-lg p-4 mb-6 text-left">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-barbershop-muted">{t('confirmation.service')}:</span>
                <span className="text-barbershop-text">{getServiceName(booking.service)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-barbershop-muted">{t('confirmation.date')}:</span>
                <span className="text-barbershop-text">{formatDisplayDate(booking.appointmentDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-barbershop-muted">{t('confirmation.time')}:</span>
                <span className="text-barbershop-text">{formatTime(booking.appointmentTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-barbershop-muted">{t('confirmation.customer')}:</span>
                <span className="text-barbershop-text">
                  {booking.customerFirstName} {booking.customerLastName}
                </span>
              </div>
              <div className="flex justify-between border-t border-barbershop-charcoal pt-2 mt-2">
                <span className="text-barbershop-muted">{t('confirmation.total')}:</span>
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
              {t('common.close')}
            </Button>
            <AddToCalendar booking={booking} className="flex-1" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
