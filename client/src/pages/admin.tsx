import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Calendar, Phone, Mail, Clock, DollarSign, Scissors } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import Navbar from "@/components/navbar";
import type { Appointment } from "@shared/schema";
import { services, type ServiceKey } from "@shared/schema";

export default function AdminPage() {
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');

  const { data: appointments = [], isLoading } = useQuery<Appointment[]>({
    queryKey: ['/api/appointments/all'],
    queryFn: async () => {
      const response = await fetch('/api/appointments/all');
      if (!response.ok) throw new Error('Failed to fetch appointments');
      return response.json();
    }
  });

  const today = new Date().toISOString().split('T')[0];
  
  const filteredAppointments = appointments.filter(appointment => {
    switch (filter) {
      case 'today':
        return appointment.appointmentDate === today;
      case 'upcoming':
        return appointment.appointmentDate >= today && (appointment.status || 'confirmed') === 'confirmed';
      case 'completed':
        return (appointment.status || 'confirmed') === 'completed';
      default:
        return true;
    }
  });

  const stats = {
    total: appointments.length,
    today: appointments.filter(a => a.appointmentDate === today).length,
    upcoming: appointments.filter(a => a.appointmentDate >= today && (a.status || 'confirmed') === 'confirmed').length,
    revenue: appointments.filter(a => (a.status || 'confirmed') === 'completed').reduce((sum, a) => sum + a.price, 0)
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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

  const getServiceName = (serviceKey: string) => {
    return services[serviceKey as ServiceKey]?.name || serviceKey;
  };

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(0)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen barbershop-bg text-barbershop-text">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="barbershop-card border-barbershop-dark">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="text-barbershop-gold h-5 w-5" />
                <div>
                  <p className="text-barbershop-muted text-sm">Total Appointments</p>
                  <p className="text-2xl font-bold text-barbershop-text">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="barbershop-card border-barbershop-dark">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="text-barbershop-gold h-5 w-5" />
                <div>
                  <p className="text-barbershop-muted text-sm">Today</p>
                  <p className="text-2xl font-bold text-barbershop-text">{stats.today}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="barbershop-card border-barbershop-dark">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="text-barbershop-gold h-5 w-5" />
                <div>
                  <p className="text-barbershop-muted text-sm">Upcoming</p>
                  <p className="text-2xl font-bold text-barbershop-text">{stats.upcoming}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="barbershop-card border-barbershop-dark">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="text-barbershop-gold h-5 w-5" />
                <div>
                  <p className="text-barbershop-muted text-sm">Revenue</p>
                  <p className="text-2xl font-bold text-barbershop-text">{formatPrice(stats.revenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 mb-6">
          {[
            { key: 'all', label: 'All Appointments' },
            { key: 'today', label: 'Today' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'completed', label: 'Completed' }
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={filter === key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(key as any)}
              className={filter === key 
                ? "barbershop-gold text-white" 
                : "barbershop-dark text-barbershop-text border-barbershop-charcoal hover:barbershop-charcoal"
              }
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Appointments List */}
        <Card className="barbershop-card border-barbershop-dark">
          <CardHeader>
            <CardTitle className="text-barbershop-text">
              Appointments ({filteredAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-barbershop-muted">
                Loading appointments...
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-8 text-barbershop-muted">
                No appointments found for the selected filter.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment._id || Math.random()}
                    className="barbershop-dark rounded-lg p-4 border border-barbershop-charcoal"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-barbershop-text">
                            {appointment.customerFirstName} {appointment.customerLastName}
                          </h3>
                          <Badge className={`${getStatusColor(appointment.status || 'confirmed')} text-white`}>
                            {appointment.status || 'confirmed'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-barbershop-gold" />
                            <span className="text-barbershop-muted">
                              {formatDate(appointment.appointmentDate)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-barbershop-gold" />
                            <span className="text-barbershop-muted">
                              {formatTime(appointment.appointmentTime)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Scissors className="h-4 w-4 text-barbershop-gold" />
                            <span className="text-barbershop-muted">
                              {getServiceName(appointment.service)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-barbershop-gold" />
                            <span className="text-barbershop-muted">
                              {formatPrice(appointment.price)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mt-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-barbershop-gold" />
                            <span className="text-barbershop-muted">
                              {appointment.customerPhone}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-barbershop-gold" />
                            <span className="text-barbershop-muted">
                              {appointment.customerEmail}
                            </span>
                          </div>
                        </div>

                        {appointment.notes && (
                          <div className="mt-3 text-sm">
                            <span className="text-barbershop-gold">Notes: </span>
                            <span className="text-barbershop-muted">{appointment.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}