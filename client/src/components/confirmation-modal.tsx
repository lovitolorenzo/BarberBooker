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
      <DialogContent className="bg-white/95 backdrop-blur-xl border-white/50 shadow-glass-lg max-w-md rounded-3xl p-0 overflow-hidden">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-accent-green rounded-full flex items-center justify-center mx-auto mb-5">
            <Check className="text-white h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            {t('confirmation.title')}
          </h3>
          <p className="text-text-secondary text-sm mb-6">
            {t('confirmation.description')}
          </p>
          
          <div className="bg-surface-secondary rounded-2xl p-5 mb-6 text-left">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">{t('confirmation.service')}:</span>
                <span className="text-text-primary font-medium">{getServiceName(booking.service)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">{t('confirmation.date')}:</span>
                <span className="text-text-primary font-medium">{formatDisplayDate(booking.appointmentDate)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">{t('confirmation.time')}:</span>
                <span className="text-text-primary font-medium">{formatTime(booking.appointmentTime)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">{t('confirmation.customer')}:</span>
                <span className="text-text-primary font-medium">
                  {booking.customerFirstName} {booking.customerLastName}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-border pt-3 mt-3">
                <span className="text-text-secondary">{t('confirmation.total')}:</span>
                <span className="text-accent-blue font-semibold text-base">
                  {formatPrice(booking.price)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-surface-secondary text-text-primary border-border hover:bg-surface-primary rounded-xl py-3 h-auto transition-all"
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
