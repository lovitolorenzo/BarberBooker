import { useState } from "react";
import { Calendar, ChevronDown, Download, ExternalLink, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
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
  const [isEmailReminderOpen, setIsEmailReminderOpen] = useState(false);
  const [email, setEmail] = useState('');
  const toast = useToast();

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

  const handleCalendarAction = async (action: string) => {
    setIsLoading(true);
    try {
      const event = createCalendarEvent();
      
      switch (action) {
        case 'google':
          window.open(generateGoogleCalendarUrl(event), '_blank');
          break;
        case 'outlook':
          window.open(generateOutlookUrl(event), '_blank');
          break;
        case 'yahoo':
          window.open(generateYahooCalendarUrl(event), '_blank');
          break;
        case 'download':
          downloadIcsFile(event, `appointment-${booking.appointmentDate}.ics`);
          break;
      }
    } catch (error) {
      console.error('Error creating calendar event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailReminder = async () => {
    try {
      await apiRequest('POST', '/api/email-reminder', { email, appointment: booking });
      toast.success('Email reminder sent successfully!');
    } catch (error) {
      console.error('Error sending email reminder:', error);
      toast.error('Failed to send email reminder. Please try again.');
    } finally {
      setIsEmailReminderOpen(false);
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
          onClick={() => handleCalendarAction('google')}
          className="text-barbershop-text hover:barbershop-charcoal cursor-pointer"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Google Calendar
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleCalendarAction('outlook')}
          className="text-barbershop-text hover:barbershop-charcoal cursor-pointer"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Outlook Calendar
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleCalendarAction('yahoo')}
          className="text-barbershop-text hover:barbershop-charcoal cursor-pointer"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Yahoo Calendar
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleCalendarAction('download')}
          className="text-barbershop-text hover:barbershop-charcoal cursor-pointer border-t border-barbershop-charcoal"
        >
          <Download className="mr-2 h-4 w-4" />
          Download .ics file
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => setIsEmailReminderOpen(true)}
          className="text-barbershop-text hover:barbershop-charcoal cursor-pointer"
        >
          <Mail className="mr-2 h-4 w-4" />
          Send Email Reminder
        </DropdownMenuItem>
      </DropdownMenuContent>
      <Dialog open={isEmailReminderOpen} onOpenChange={setIsEmailReminderOpen}>
        <DialogTrigger asChild>
          <Button className="hidden" />
        </DialogTrigger>
        <DialogContent className="barbershop-card border-barbershop-dark">
          <DialogHeader>
            <DialogTitle>Send Email Reminder</DialogTitle>
          </DialogHeader>
          <Label>Email Address</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button onClick={handleEmailReminder} className="mt-4">Send Reminder</Button>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
}
