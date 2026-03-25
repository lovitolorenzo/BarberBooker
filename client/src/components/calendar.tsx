import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { apiGet } from "@/config/api";
import type { Appointment, BusinessHoursConfig } from "@shared/schema";

interface CalendarProps {
  selectedDate: string | null;
  selectedTime: string | null;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  isAdmin?: boolean;
}

const parseTimeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const formatMinutesToTime = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const getEndOfCurrentWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilSaturday = dayOfWeek === 0 ? 6 : 6 - dayOfWeek;
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + daysUntilSaturday);
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek;
};

const getTimeSlotsForDate = (dateStr: string | null, businessHours?: BusinessHoursConfig): string[] => {
  if (!dateStr || !businessHours) {
    return [];
  }

  const date = new Date(`${dateStr}T00:00:00`);
  const dayConfig = businessHours.days.find((day) => day.dayOfWeek === date.getDay());

  if (!dayConfig || !dayConfig.enabled) {
    return [];
  }

  const slots: string[] = [];
  const openMinutes = parseTimeToMinutes(dayConfig.openTime);
  const closeMinutes = parseTimeToMinutes(dayConfig.closeTime);

  for (let current = openMinutes; current < closeMinutes; current += businessHours.slotIntervalMinutes) {
    slots.push(formatMinutesToTime(current));
  }

  return slots;
};

export default function CalendarComponent({ 
  selectedDate, 
  selectedTime, 
  onDateSelect, 
  onTimeSelect,
  isAdmin = false
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { t } = useTranslation();
  const bookingWindowEnd = getEndOfCurrentWeek();

  // Get appointments for the current month
  const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString().split('T')[0];
  const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).toISOString().split('T')[0];
  
  const { data: appointments = [] } = useQuery<Appointment[]>({
    queryKey: ['/api/appointments/range', { startDate, endDate }],
    queryFn: async () => {
      const response = await apiGet(`/api/appointments/range?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) throw new Error('Failed to fetch appointments');
      return response.json();
    }
  });

  const { data: businessHours } = useQuery<BusinessHoursConfig>({
    queryKey: ["/api/business-hours"],
    queryFn: async () => {
      const response = await apiGet("/api/business-hours");
      if (!response.ok) throw new Error("Failed to fetch business hours");
      return response.json();
    }
  });

  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  
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

  const isSlotBooked = (date: string, time: string) => {
    return appointments.some(apt => 
      apt.appointmentDate === date && 
      apt.appointmentTime === time && 
      apt.status === 'confirmed'
    );
  };

  const isPastSlot = (date: string, time: string) => {
    const now = new Date();
    const slotDateTime = new Date(`${date}T${time}:00`);
    return slotDateTime.getTime() < now.getTime();
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: JSX.Element[] = [];
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dateStr = formatDate(currentDate);
      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = dateStr === formatDate(new Date());
      const isSelected = selectedDate === dateStr;
      const isPast = currentDate.getTime() < new Date().setHours(0, 0, 0, 0);
      const dayConfig = businessHours?.days.find((day) => day.dayOfWeek === currentDate.getDay());
      const isClosedDay = !dayConfig?.enabled;
      
      const isBeyondBookingWindow = !isAdmin && currentDate.getTime() > bookingWindowEnd.getTime();

      days.push(
        <Button
          key={i}
          variant="ghost"
          className={`
            h-10 w-full text-sm font-medium rounded-xl transition-all
            ${isCurrentMonth ? 'text-text-primary' : 'text-text-secondary/40'}
            ${isToday && !isSelected ? 'bg-accent-blue/10 text-accent-blue' : ''}
            ${isSelected ? 'bg-accent-blue text-white hover:bg-accent-blue/90' : ''}
            ${!isToday && !isSelected && isCurrentMonth ? 'hover:bg-surface-secondary' : ''}
            ${isPast || isBeyondBookingWindow || isClosedDay ? 'opacity-40 cursor-not-allowed' : ''}
          `}
          disabled={isPast || !isCurrentMonth || isBeyondBookingWindow || isClosedDay}
          onClick={() => !isPast && isCurrentMonth && !isBeyondBookingWindow && !isClosedDay && onDateSelect(dateStr)}
        >
          {currentDate.getDate()}
        </Button>
      );
    }

    return days;
  };

  const renderTimeSlots = () => {
    if (!selectedDate) return null;

    const timeSlots = getTimeSlotsForDate(selectedDate, businessHours);

    if (timeSlots.length === 0) {
      return (
        <div className="space-y-4">
          <h3 className="text-base font-medium text-text-primary">{t('available_times')}</h3>
          <p className="text-sm text-text-secondary">
            {t("booking.noSlotsForDay", { defaultValue: "Nessun orario disponibile per questo giorno" })}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-base font-medium text-text-primary">{t('available_times')}</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {timeSlots.map(time => {
            const isBooked = isSlotBooked(selectedDate, time);
            const isPast = isPastSlot(selectedDate, time);
            const isSelected = selectedTime === time;

            return (
              <Button
                key={time}
                variant="outline"
                size="sm"
                className={`
                  py-2.5 px-3 text-sm font-medium rounded-xl transition-all border
                  ${isSelected ? 'bg-accent-blue text-white border-accent-blue hover:bg-accent-blue/90' : ''}
                  ${isBooked ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : ''}
                  ${isPast ? 'bg-gray-50 text-gray-300 cursor-not-allowed border-gray-100' : ''}
                  ${!isSelected && !isBooked && !isPast ? 'bg-accent-green/10 text-accent-green border-accent-green/30 hover:bg-accent-green hover:text-white hover:border-accent-green' : ''}
                `}
                disabled={isBooked || isPast}
                onClick={() => !isBooked && !isPast && onTimeSelect(time)}
              >
                {formatTime(time)}
              </Button>
            );
          })}
        </div>
      </div>
    );
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="glass-card rounded-3xl p-6 shadow-glass">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">{t('select_date_time')}</h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousMonth}
            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-text-primary px-3 min-w-[140px] text-center">
            {currentMonth.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextMonth}
            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mb-6">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {[t('sunday'), t('monday'), t('tuesday'), t('wednesday'), t('thursday'), t('friday'), t('saturday')].map(day => (
            <div key={day} className="text-center text-xs font-medium text-text-secondary py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {renderCalendar()}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && renderTimeSlots()}

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent-green"></div>
            <span className="text-text-secondary">{t('available')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent-blue"></div>
            <span className="text-text-secondary">{t('selected')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <span className="text-text-secondary">{t('booked')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-200"></div>
            <span className="text-text-secondary">{t('past')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
