export interface CalendarEvent {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
}

export function formatDateForCalendar(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const startDate = formatDateForCalendar(event.startDate);
  const endDate = formatDateForCalendar(event.endDate);
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startDate}/${endDate}`,
    details: event.description,
    ...(event.location && { location: event.location })
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function generateOutlookUrl(event: CalendarEvent): string {
  const startDate = event.startDate.toISOString();
  const endDate = event.endDate.toISOString();
  
  const params = new URLSearchParams({
    subject: event.title,
    startdt: startDate,
    enddt: endDate,
    body: event.description,
    ...(event.location && { location: event.location })
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function generateYahooCalendarUrl(event: CalendarEvent): string {
  const duration = Math.round((event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60)); // duration in minutes
  
  const params = new URLSearchParams({
    v: '60',
    title: event.title,
    st: formatDateForCalendar(event.startDate),
    dur: duration.toString().padStart(4, '0'), // format as HHMM
    desc: event.description,
    ...(event.location && { in_loc: event.location })
  });

  return `https://calendar.yahoo.com/?${params.toString()}`;
}

export function generateIcsFile(event: CalendarEvent): string {
  const startDate = formatDateForCalendar(event.startDate);
  const endDate = formatDateForCalendar(event.endDate);
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BarberBooker//EN',
    'BEGIN:VEVENT',
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    ...(event.location ? [`LOCATION:${event.location}`] : []),
    `UID:${Date.now()}@barberbooker.com`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return icsContent;
}

export function downloadIcsFile(event: CalendarEvent, filename = 'appointment.ics'): void {
  const icsContent = generateIcsFile(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
