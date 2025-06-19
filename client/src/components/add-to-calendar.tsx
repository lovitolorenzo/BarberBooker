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

  const createCalendarEvent = (): CalendarEvent => {
    const serviceName = services[booking.service as ServiceKey]?.name || booking.service;
    
    // Combine date and time to create start Date
    const startDate = new Date(`${booking.appointmentDate}T${booking.appointmentTime}:00`);
    
    // Calculate end date by adding duration
    const endDate = new Date(startDate.getTime() + booking.duration * 60 * 1000);
    
    const title = `Barber Appointment - ${serviceName}`;
    const description = [
      `Service: ${serviceName}`,
      `Customer: ${booking.customerFirstName} ${booking.customerLastName}`,
      `Phone: ${booking.customerPhone || 'Not provided'}`,
      `Duration: ${booking.duration} minutes`,
      `Price: $${(booking.price / 100).toFixed(0)}`,
      ...(booking.notes ? [`Notes: ${booking.notes}`] : []),
      '',
      'Booked via BarberBooker'
    ].join('\n');

    return {
      title,
      description,
      startDate,
      endDate,
      location: "BarberShop" // Could be made configurable
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
        title: "Error",
        description: "Failed to download calendar file. Please try again.",
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
          Add to Calendar
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="barbershop-card border-barbershop-dark" align="end">
        <DropdownMenuItem 
          onClick={handleGoogleCalendar}
          className="text-barbershop-text hover:barbershop-charcoal cursor-pointer"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Google Calendar
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleOutlookCalendar}
          className="text-barbershop-text hover:barbershop-charcoal cursor-pointer"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Outlook Calendar
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleYahooCalendar}
          className="text-barbershop-text hover:barbershop-charcoal cursor-pointer"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Yahoo Calendar
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleDownloadIcs}
          className="text-barbershop-text hover:barbershop-charcoal cursor-pointer border-t border-barbershop-charcoal"
        >
          <Download className="mr-2 h-4 w-4" />
          Download .ics file
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
