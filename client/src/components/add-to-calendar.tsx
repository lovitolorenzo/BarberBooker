import { useState } from "react";
import { Calendar, ChevronDown, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import {
  generateGoogleCalendarUrl,
  generateOutlookUrl,
  generateYahooCalendarUrl,
  downloadIcsFile,
  type CalendarEvent
} from "@/lib/calendar-utils";
import type { Appointment } from "@shared/schema";
import { services, type ServiceKey } from "@shared/schema";

interface AddToCalendarProps {
  booking: Appointment;
  className?: string;
}

export default function AddToCalendar({ booking, className = "" }: AddToCalendarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const createCalendarEvent = (): CalendarEvent => {
    const serviceName = services[booking.service as ServiceKey]?.name || booking.service;
    
    // Combine date and time to create start Date
    const startDate = new Date(`${booking.appointmentDate}T${booking.appointmentTime}:00`);
    
    // Calculate end date by adding duration
    const endDate = new Date(startDate.getTime() + booking.duration * 60 * 1000);
    
    const title = t('addToCalendar.appointmentTitle', { service: serviceName });
    const description = [
      `${t('confirmation.service')}: ${serviceName}`,
      `${t('confirmation.customer')}: ${booking.customerFirstName} ${booking.customerLastName}`,
      `${t('confirmation.phone')}: ${booking.customerPhone || 'Not provided'}`,
      `${t('booking.duration')} ${booking.duration} ${t('booking.minutes')}`,
      `Price: $${(booking.price / 100).toFixed(0)}`,
      ...(booking.notes ? [`${t('confirmation.notes')}: ${booking.notes}`] : []),
      '',
      'Booked via Duo Lab'
    ].join('\n');

    return {
      title,
      description,
      startDate,
      endDate,
      location: "Duo Lab" // Could be made configurable
    };
  };

  const handleGoogleCalendar = () => {
    const event = createCalendarEvent();
    const url = generateGoogleCalendarUrl(event);
    window.open(url, '_blank');
  };

  const handleOutlookCalendar = () => {
    const event = createCalendarEvent();
    const url = generateOutlookUrl(event);
    window.open(url, '_blank');
  };

  const handleYahooCalendar = () => {
    const event = createCalendarEvent();
    const url = generateYahooCalendarUrl(event);
    window.open(url, '_blank');
  };

  const handleDownloadIcs = async () => {
    try {
      setIsLoading(true);
      const event = createCalendarEvent();
      downloadIcsFile(event, `appointment-${booking.appointmentDate}.ics`);
    } catch (error) {
      console.error('Error downloading .ics file:', error);
      toast({
        title: t("common.error"),
        description: t("addToCalendar.error"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`barbershop-gold text-black font-semibold hover:bg-yellow-500 transition-colors ${className}`}
          disabled={isLoading}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {t('addToCalendar.button')}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="barbershop-card border-barbershop-dark" align="end">
        <DropdownMenuItem 
          onClick={handleGoogleCalendar}
          className="text-barbershop-text hover:barbershop-charcoal cursor-pointer"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          {t('addToCalendar.googleCalendar')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleOutlookCalendar}
          className="text-barbershop-text hover:barbershop-charcoal cursor-pointer"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          {t('addToCalendar.outlookCalendar')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleYahooCalendar}
          className="text-barbershop-text hover:barbershop-charcoal cursor-pointer"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          {t('addToCalendar.yahooCalendar')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleDownloadIcs}
          className="text-barbershop-text hover:barbershop-charcoal cursor-pointer border-t border-barbershop-charcoal"
        >
          <Download className="mr-2 h-4 w-4" />
          {t('addToCalendar.downloadIcs')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
