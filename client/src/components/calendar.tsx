import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Appointment } from "@shared/schema";

interface CalendarProps {
  selectedDate: string | null;
  selectedTime: string | null;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

export default function CalendarComponent({ 
  selectedDate, 
  selectedTime, 
  onDateSelect, 
  onTimeSelect 
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get appointments for the current month
  const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString().split('T')[0];
  const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).toISOString().split('T')[0];
  
  const { data: appointments = [] } = useQuery<Appointment[]>({
    queryKey: ['/api/appointments/range', { startDate, endDate }],
    queryFn: async () => {
      const response = await fetch(`/api/appointments/range?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) throw new Error('Failed to fetch appointments');
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
    return slotDateTime < now;
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dateStr = formatDate(currentDate);
      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = dateStr === formatDate(new Date());
      const isSelected = selectedDate === dateStr;
      const isPast = currentDate < new Date().setHours(0, 0, 0, 0);

      days.push(
        <Button
          key={i}
          variant="ghost"
          className={`
            h-10 w-full text-sm font-medium rounded-lg transition-all
            ${isCurrentMonth ? 'text-barbershop-text' : 'text-barbershop-muted'}
            ${isToday ? 'barbershop-gold text-black' : ''}
            ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
            ${!isToday && !isSelected && isCurrentMonth ? 'hover:barbershop-dark' : ''}
            ${isPast ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          disabled={isPast || !isCurrentMonth}
          onClick={() => !isPast && isCurrentMonth && onDateSelect(dateStr)}
        >
          {currentDate.getDate()}
        </Button>
      );
    }

    return days;
  };

  const renderTimeSlots = () => {
    if (!selectedDate) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-barbershop-text">Available Times</h3>
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
                  py-2 px-3 text-sm font-medium rounded-lg transition-all
                  ${isSelected ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600' : ''}
                  ${isBooked ? 'bg-gray-500 text-gray-300 cursor-not-allowed border-gray-500' : ''}
                  ${isPast ? 'bg-gray-700 text-gray-500 cursor-not-allowed border-gray-700' : ''}
                  ${!isSelected && !isBooked && !isPast ? 'bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-500' : ''}
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
    <Card className="barbershop-card border-barbershop-dark shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-barbershop-text">Select Date & Time</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousMonth}
              className="p-2 text-barbershop-muted hover:text-barbershop-gold transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-medium text-barbershop-text px-4">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextMonth}
              className="p-2 text-barbershop-muted hover:text-barbershop-gold transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="mb-6">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-barbershop-muted py-2">
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
        <div className="mt-6 pt-6 border-t border-barbershop-dark">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded bg-emerald-500"></div>
              <span className="text-barbershop-muted">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span className="text-barbershop-muted">Selected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded bg-gray-500"></div>
              <span className="text-barbershop-muted">Booked</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded bg-gray-700"></div>
              <span className="text-barbershop-muted">Past</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
