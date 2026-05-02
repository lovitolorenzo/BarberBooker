import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, DollarSign, Clock, Phone, Mail, Scissors } from "lucide-react";
import Navbar from "@/components/navbar";
import { useTranslation } from "react-i18next";
import { apiGet, apiRequest } from "@/config/api";
import type {
  Appointment,
  BusinessHoursConfig,
  InsertServiceConfig,
  ServiceConfig,
  UpdateServiceConfig,
} from "@shared/schema";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function AdminPage() {
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const { userRole } = useAuth();
  const { toast } = useToast();
  const isAdmin = userRole === "admin";
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDuration, setNewServiceDuration] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceSortOrder, setNewServiceSortOrder] = useState("0");
  const [newServiceEnabled, setNewServiceEnabled] = useState(true);
  const [editableBusinessHours, setEditableBusinessHours] = useState<BusinessHoursConfig | null>(null);

  const { data: appointments = [], isLoading } = useQuery<Appointment[]>({
    queryKey: ['/api/appointments/all'],
    queryFn: async () => {
      const response = await apiGet('/api/appointments/all');
      if (!response.ok) throw new Error('Failed to fetch appointments');
      return response.json();
    }
  });

  const { data: serviceConfigs = [], isLoading: isServicesLoading } = useQuery<ServiceConfig[]>({
    queryKey: ["/api/admin/services"],
    enabled: isAdmin,
    queryFn: async () => {
      const response = await apiGet("/api/admin/services");
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });

  const { data: publicServiceConfigs = [], isLoading: isPublicServicesLoading } = useQuery<ServiceConfig[]>({
    queryKey: ["/api/services"],
    queryFn: async () => {
      const response = await apiGet("/api/services");
      if (!response.ok) throw new Error("Failed to fetch public services");
      return response.json();
    },
  });

  const { data: businessHoursConfig, isLoading: isBusinessHoursLoading } = useQuery<BusinessHoursConfig>({
    queryKey: ["/api/admin/business-hours"],
    enabled: isAdmin,
    queryFn: async () => {
      const response = await apiGet("/api/admin/business-hours");
      if (!response.ok) throw new Error("Failed to fetch business hours");
      return response.json();
    },
  });

  const { data: publicBusinessHoursConfig, isLoading: isPublicBusinessHoursLoading } = useQuery<BusinessHoursConfig>({
    queryKey: ["/api/business-hours"],
    queryFn: async () => {
      const response = await apiGet("/api/business-hours");
      if (!response.ok) throw new Error("Failed to fetch public business hours");
      return response.json();
    },
  });

  useEffect(() => {
    const resolvedBusinessHoursConfig = businessHoursConfig ?? publicBusinessHoursConfig;
    if (resolvedBusinessHoursConfig) {
      setEditableBusinessHours(resolvedBusinessHoursConfig);
    }
  }, [businessHoursConfig, publicBusinessHoursConfig]);

  const createServiceMutation = useMutation({
    mutationFn: async (payload: InsertServiceConfig) => {
      const response = await apiRequest("POST", "/api/admin/services", payload);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to create service");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setNewServiceName("");
      setNewServiceDuration("");
      setNewServicePrice("");
      setNewServiceSortOrder("0");
      setNewServiceEnabled(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ key, update }: { key: string; update: UpdateServiceConfig }) => {
      const response = await apiRequest("PUT", `/api/admin/services/${key}`, update);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to update service");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (key: string) => {
      const response = await apiRequest("DELETE", `/api/admin/services/${key}`);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to delete service");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateBusinessHoursMutation = useMutation({
    mutationFn: async (payload: BusinessHoursConfig) => {
      const response = await apiRequest("PUT", "/api/admin/business-hours", {
        slotIntervalMinutes: payload.slotIntervalMinutes,
        days: payload.days,
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to update business hours");
      }
      return response.json();
    },
    onSuccess: (updated: BusinessHoursConfig) => {
      setEditableBusinessHours(updated);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/business-hours"] });
      queryClient.invalidateQueries({ queryKey: ["/api/business-hours"] });
      toast({
        title: "Successo",
        description: "Orari di apertura aggiornati",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    },
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
    if (i18n.language === 'it') {
      const weekdays = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
      const months = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 
                     'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
      return `${weekdays[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
    }
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    if (i18n.language === 'it') {
      return timeStr; // 24-hour format for Italian
    }
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const weekdayLabels = [
    "Domenica",
    "Lunedì",
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venerdì",
    "Sabato",
  ];

  const getServiceName = (serviceKeyOrName: string) => {
    const normalized = serviceKeyOrName?.toLowerCase?.() || serviceKeyOrName;
    const serviceTranslations: { [key: string]: string } = {
      haircut: t("haircut"),
      beard: t("beard"),
      full: t("styling"),
      shave: t("shave"),
      wash: t("wash"),
    };
    const configuredService = serviceConfigs.find(
      (service) => service.key === serviceKeyOrName || service.name === serviceKeyOrName
    );
    return configuredService?.name || serviceTranslations[normalized] || serviceKeyOrName;
  };

  const parsePriceToCents = (value: string) => {
    const normalized = value.replace(",", ".").trim();
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? Math.round(parsed * 100) : NaN;
  };

  const generateServiceKey = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const updateBusinessDay = (
    dayOfWeek: number,
    field: "enabled" | "openTime" | "closeTime",
    value: boolean | string
  ) => {
    setEditableBusinessHours((current) => {
      if (!current) return current;
      return {
        ...current,
        days: current.days.map((day) =>
          day.dayOfWeek === dayOfWeek ? { ...day, [field]: value } : day
        ),
      };
    });
  };

  const handleCreateService = () => {
    const duration = Number(newServiceDuration);
    const price = parsePriceToCents(newServicePrice);
    const sortOrder = Number(newServiceSortOrder);
    const name = newServiceName.trim();
    const generatedKey = generateServiceKey(name);

    if (!name || !generatedKey) {
      return;
    }

    if (!Number.isInteger(duration) || duration <= 0) {
      return;
    }

    if (!Number.isInteger(price) || price < 0) {
      return;
    }

    if (!Number.isInteger(sortOrder)) {
      return;
    }

    createServiceMutation.mutate({
      key: generatedKey,
      name,
      duration,
      price,
      enabled: newServiceEnabled,
      sortOrder,
    });
  };

  const formatPrice = (priceInCents: number) => {
    if (i18n.language === 'it') {
      return `€${(priceInCents / 100).toFixed(0)}`;
    }
    return `$${(priceInCents / 100).toFixed(0)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'no-show': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    return t(`admin.status.${status}`) || status;
  };

  const resolvedServiceConfigs = serviceConfigs.length > 0 ? serviceConfigs : publicServiceConfigs;
  const resolvedBusinessHours = editableBusinessHours ?? businessHoursConfig ?? publicBusinessHoursConfig ?? null;
  const servicesSectionLoading = isServicesLoading || (resolvedServiceConfigs.length === 0 && isPublicServicesLoading);
  const businessHoursSectionLoading = isBusinessHoursLoading || (!resolvedBusinessHours && isPublicBusinessHoursLoading);

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
                  <p className="text-barbershop-muted text-sm">{t('admin.totalAppointments')}</p>
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
                  <p className="text-barbershop-muted text-sm">{t('admin.today')}</p>
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
                  <p className="text-barbershop-muted text-sm">{t('admin.upcoming')}</p>
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
                  <p className="text-barbershop-muted text-sm">{t('admin.revenue')}</p>
                  <p className="text-2xl font-bold text-barbershop-text">{formatPrice(stats.revenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isAdmin && (
          <Card className="barbershop-card border-barbershop-dark mb-8">
            <CardHeader>
              <CardTitle className="text-barbershop-text">Gestione Servizi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
                <Input
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="Nome servizio"
                  className="barbershop-dark text-barbershop-text border-barbershop-charcoal"
                />
                <Input
                  value={newServiceDuration}
                  onChange={(e) => setNewServiceDuration(e.target.value)}
                  placeholder="Durata (min)"
                  className="barbershop-dark text-barbershop-text border-barbershop-charcoal"
                />
                <Input
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(e.target.value)}
                  placeholder="Prezzo (€)"
                  className="barbershop-dark text-barbershop-text border-barbershop-charcoal"
                />
                <Input
                  value={newServiceSortOrder}
                  onChange={(e) => setNewServiceSortOrder(e.target.value)}
                  placeholder="Ordine"
                  className="barbershop-dark text-barbershop-text border-barbershop-charcoal"
                />
                <div className="flex items-center justify-between rounded-md border border-barbershop-charcoal px-3 py-2 barbershop-dark">
                  <span className="text-sm text-barbershop-muted">Attivo</span>
                  <Switch checked={newServiceEnabled} onCheckedChange={setNewServiceEnabled} />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleCreateService}
                  disabled={createServiceMutation.isPending}
                  className="barbershop-gold text-white"
                >
                  {createServiceMutation.isPending ? "Salvataggio..." : "Aggiungi servizio"}
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-barbershop-text">Servizi esistenti</h3>
                  <Badge variant="secondary">{resolvedServiceConfigs.length}</Badge>
                </div>
                {servicesSectionLoading ? (
                  <div className="rounded-lg border border-barbershop-charcoal p-4 text-sm text-barbershop-muted barbershop-dark">
                    Caricamento servizi...
                  </div>
                ) : resolvedServiceConfigs.length === 0 ? (
                  <div className="rounded-lg border border-barbershop-charcoal p-4 text-sm text-barbershop-muted barbershop-dark">
                    Nessun servizio configurato.
                  </div>
                ) : (
                  resolvedServiceConfigs.map((service) => (
                    <div
                      key={service.key}
                      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 items-center rounded-lg border border-barbershop-charcoal p-3 barbershop-dark"
                    >
                      <div className="space-y-1">
                        <span className="text-xs text-barbershop-muted md:hidden">Nome</span>
                        <Input
                          defaultValue={service.name}
                          onBlur={(e) => {
                            if (e.target.value !== service.name) {
                              updateServiceMutation.mutate({ key: service.key, update: { name: e.target.value } });
                            }
                          }}
                          className="barbershop-dark text-barbershop-text border-barbershop-charcoal"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-barbershop-muted md:hidden">Durata</span>
                        <Input
                          defaultValue={String(service.duration)}
                          onBlur={(e) => {
                            const duration = Number(e.target.value);
                            if (Number.isInteger(duration) && duration > 0 && duration !== service.duration) {
                              updateServiceMutation.mutate({ key: service.key, update: { duration } });
                            }
                          }}
                          className="barbershop-dark text-barbershop-text border-barbershop-charcoal"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-barbershop-muted md:hidden">Prezzo</span>
                        <Input
                          defaultValue={(service.price / 100).toFixed(2)}
                          onBlur={(e) => {
                            const price = parsePriceToCents(e.target.value);
                            if (Number.isInteger(price) && price >= 0 && price !== service.price) {
                              updateServiceMutation.mutate({ key: service.key, update: { price } });
                            }
                          }}
                          className="barbershop-dark text-barbershop-text border-barbershop-charcoal"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-barbershop-muted md:hidden">Ordine</span>
                        <Input
                          defaultValue={String(service.sortOrder)}
                          onBlur={(e) => {
                            const sortOrder = Number(e.target.value);
                            if (Number.isInteger(sortOrder) && sortOrder !== service.sortOrder) {
                              updateServiceMutation.mutate({ key: service.key, update: { sortOrder } });
                            }
                          }}
                          className="barbershop-dark text-barbershop-text border-barbershop-charcoal"
                        />
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center justify-between rounded-md border border-barbershop-charcoal px-3 py-2 md:border-0 md:px-0 md:py-0">
                          <span className="text-sm text-barbershop-muted">Attivo</span>
                          <Switch
                            checked={service.enabled}
                            onCheckedChange={(enabled) =>
                              updateServiceMutation.mutate({ key: service.key, update: { enabled } })
                            }
                          />
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => deleteServiceMutation.mutate(service.key)}
                          disabled={deleteServiceMutation.isPending}
                          className="w-full sm:w-auto"
                        >
                          Elimina
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {isAdmin && (
          <Card className="barbershop-card border-barbershop-dark mb-8">
            <CardHeader>
              <CardTitle className="text-barbershop-text">Orari di Apertura</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {businessHoursSectionLoading ? (
                <div className="rounded-lg border border-barbershop-charcoal p-4 text-sm text-barbershop-muted barbershop-dark">
                  Caricamento orari di apertura...
                </div>
              ) : resolvedBusinessHours ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-center">
                    <span className="text-sm text-barbershop-muted">Intervallo slot (minuti)</span>
                    <Input
                      type="number"
                      min="5"
                      step="5"
                      value={String(resolvedBusinessHours.slotIntervalMinutes)}
                      onChange={(e) =>
                        setEditableBusinessHours({
                          ...resolvedBusinessHours,
                          slotIntervalMinutes: Number(e.target.value) || resolvedBusinessHours.slotIntervalMinutes,
                        })
                      }
                      className="barbershop-dark text-barbershop-text border-barbershop-charcoal"
                    />
                  </div>

                  <div className="space-y-3">
                    {resolvedBusinessHours.days
                      .slice()
                      .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                      .map((day) => (
                        <div
                          key={day.dayOfWeek}
                          className="grid grid-cols-1 md:grid-cols-[180px_120px_1fr_1fr] gap-3 items-center rounded-lg border border-barbershop-charcoal p-3 barbershop-dark"
                        >
                          <div className="space-y-1">
                            <span className="text-xs text-barbershop-muted md:hidden">Giorno</span>
                            <span className="text-sm text-barbershop-text">{weekdayLabels[day.dayOfWeek]}</span>
                          </div>
                          <div className="flex items-center justify-between rounded-md border border-barbershop-charcoal px-3 py-2 md:border-0 md:px-0 md:py-0">
                            <span className="text-sm text-barbershop-muted">Aperto</span>
                            <Switch
                              checked={day.enabled}
                              onCheckedChange={(enabled) => updateBusinessDay(day.dayOfWeek, "enabled", enabled)}
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-barbershop-muted md:hidden">Apertura</span>
                            <Input
                              type="time"
                              value={day.openTime}
                              disabled={!day.enabled}
                              onChange={(e) => updateBusinessDay(day.dayOfWeek, "openTime", e.target.value)}
                              className="barbershop-dark text-barbershop-text border-barbershop-charcoal"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-barbershop-muted md:hidden">Chiusura</span>
                            <Input
                              type="time"
                              value={day.closeTime}
                              disabled={!day.enabled}
                              onChange={(e) => updateBusinessDay(day.dayOfWeek, "closeTime", e.target.value)}
                              className="barbershop-dark text-barbershop-text border-barbershop-charcoal"
                            />
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => updateBusinessHoursMutation.mutate(resolvedBusinessHours)}
                      disabled={updateBusinessHoursMutation.isPending}
                      className="barbershop-gold text-white w-full sm:w-auto"
                    >
                      {updateBusinessHoursMutation.isPending ? "Salvataggio..." : "Salva orari"}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="rounded-lg border border-barbershop-charcoal p-4 text-sm text-barbershop-muted barbershop-dark">
                  Nessun orario di apertura disponibile.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex space-x-2 mb-6">
          {[
            { key: 'all', label: t('admin.allAppointments') },
            { key: 'today', label: t('admin.todayFilter') },
            { key: 'upcoming', label: t('admin.upcomingFilter') },
            { key: 'completed', label: t('admin.completed') }
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
              {t('admin.appointments')} ({filteredAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-barbershop-muted">
                {t('admin.loading')}
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-8 text-barbershop-muted">
                {t('admin.noAppointments')}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment._id || `${appointment.customerPhone || 'no-phone'}-${appointment.appointmentDate}-${appointment.appointmentTime}`}
                    className="barbershop-dark rounded-lg p-4 border border-barbershop-charcoal"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-barbershop-text">
                            {appointment.customerFirstName} {appointment.customerLastName}
                          </h3>
                          <Badge className={`${getStatusColor(appointment.status || 'confirmed')} text-white`}>
                            {getStatusText(appointment.status || 'confirmed')}
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
                              {getServiceName(appointment.serviceKey || appointment.service)}
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
                              {appointment.customerPhone || '-'}
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
                            <span className="text-barbershop-gold">{t('admin.notes')}: </span>
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