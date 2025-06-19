import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Package, 
  AlertTriangle,
  Calendar,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import Navbar from "@/components/navbar";
import type { Appointment, Client, Product, ServiceProduct } from "@shared/schema";
import { services, type ServiceKey } from "@shared/schema";
import { useTranslation } from "react-i18next";

interface RevenueData {
  date: string;
  revenue: number;
  appointments: number;
  services: { [key: string]: number };
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const { t, i18n } = useTranslation();

  const getDateRange = () => {
    const end = new Date().toISOString().split('T')[0];
    const start = new Date();
    switch (dateRange) {
      case '7d':
        start.setDate(start.getDate() - 7);
        break;
      case '30d':
        start.setDate(start.getDate() - 30);
        break;
      case '90d':
        start.setDate(start.getDate() - 90);
        break;
    }
    return { start: start.toISOString().split('T')[0], end };
  };

  const { start, end } = getDateRange();

  const { data: appointments = [] } = useQuery<Appointment[]>({
    queryKey: ['/api/appointments/all']
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['/api/analytics/clients']
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/analytics/products']
  });

  const { data: lowStockProducts = [] } = useQuery<Product[]>({
    queryKey: ['/api/analytics/products/low-stock']
  });

  const { data: serviceProducts = [] } = useQuery<ServiceProduct[]>({
    queryKey: ['/api/analytics/service-products']
  });

  const { data: revenueData = [] } = useQuery<RevenueData[]>({
    queryKey: ['/api/analytics/revenue', start, end],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/revenue/${start}/${end}`);
      if (!response.ok) throw new Error('Failed to fetch revenue data');
      return response.json();
    }
  });

  // Client metrics calculations
  const totalClients = clients.length;
  const avgSpendPerVisit = clients.length > 0 
    ? clients.reduce((sum, client) => sum + (client.totalSpent / Math.max(client.totalVisits, 1)), 0) / clients.length 
    : 0;
  const avgVisitFrequency = clients.length > 0
    ? clients.reduce((sum, client) => sum + client.totalVisits, 0) / clients.length
    : 0;
  const totalLifetimeValue = clients.reduce((sum, client) => sum + client.totalSpent, 0);

  // Business metrics calculations
  const totalRevenue = revenueData.reduce((sum, day) => sum + day.revenue, 0);
  const totalAppointments = revenueData.reduce((sum, day) => sum + day.appointments, 0);
  const avgDailyRevenue = revenueData.length > 0 ? totalRevenue / revenueData.length : 0;

  // Extract service name helper
  const getServiceName = (serviceKey: string) => {
    const serviceTranslations: { [key: string]: string } = {
      'haircut': t('haircut'),
      'beard': t('beard'), 
      'shave': t('shave'),
      'styling': t('styling'),
      'wash': t('wash'),
      'mustache': t('mustache'),
      'fullservice': t('fullservice')
    };
    return serviceTranslations[serviceKey.toLowerCase()] || services[serviceKey as ServiceKey]?.name || serviceKey;
  };

  // Service popularity
  const serviceStats = appointments.reduce((acc, appointment) => {
    const service = appointment.service;
    acc[service] = (acc[service] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const serviceChartData = Object.entries(serviceStats).map(([service, count]) => ({
    name: getServiceName(service),
    value: count,
    percentage: ((count / appointments.length) * 100).toFixed(1)
  }));

  // Peak hours analysis
  const hourlyStats = appointments.reduce((acc, appointment) => {
    const hour = appointment.appointmentTime.split(':')[0];
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const hourlyChartData = Object.entries(hourlyStats)
    .map(([hour, count]) => ({
      hour: `${hour}:00`,
      appointments: count
    }))
    .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

  // Cost calculations
  const serviceCosts = serviceProducts.reduce((acc, sp) => {
    if (!acc[sp.serviceType]) {
      acc[sp.serviceType] = 0;
    }
    acc[sp.serviceType] += sp.costPerService;
    return acc;
  }, {} as { [key: string]: number });

  const profitMargins = Object.entries(serviceCosts).map(([serviceType, cost]) => {
    const servicePrice = (services[serviceType as ServiceKey]?.price || 0) * 100;
    const profit = servicePrice - cost;
    
    // Safe margin calculation
    let margin = 0;
    if (servicePrice > 0) {
      margin = parseFloat(((profit / servicePrice) * 100).toFixed(1));
    } else if (cost > 0) {
      margin = -100; // 100% loss if no price but has cost
    }
    
    return {
      service: serviceType,
      cost: Math.max(0, cost / 100), // Ensure non-negative
      price: Math.max(0, servicePrice / 100), // Ensure non-negative
      profit: profit / 100, // This can be negative
      margin: isFinite(margin) ? margin : 0 // Ensure finite number
    };
  });

  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount);
    const formattedAmount = absAmount.toFixed(2);
    const prefix = amount < 0 ? '-' : '';
    
    if (i18n.language === 'it') {
      return `${prefix}€${formattedAmount}`;
    }
    return `${prefix}$${formattedAmount}`;
  };

  const formatMargin = (margin: number) => {
    if (!isFinite(margin)) return '0%';
    return `${margin.toFixed(1)}%`;
  };

  const COLORS = ['#B8860B', '#8B7355', '#CD853F', '#DEB887', '#F4A460'];

  return (
    <div className="min-h-screen barbershop-bg text-barbershop-text">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('navbar.analytics')}</h1>

        {/* Date Range Selector */}
        <div className="flex space-x-2 mb-8">
          {[
            { key: '7d', label: t('analytics.dateRanges.7d') },
            { key: '30d', label: t('analytics.dateRanges.30d') },
            { key: '90d', label: t('analytics.dateRanges.90d') }
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={dateRange === key ? "default" : "outline"}
              onClick={() => setDateRange(key as '7d' | '30d' | '90d')}
              className={dateRange === key 
                ? "bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90" 
                : "border-barbershop-gold text-barbershop-gold hover:bg-barbershop-gold hover:text-barbershop-dark"
              }
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Client Metrics */}
        <Card className="mb-8 barbershop-card border-barbershop-dark">
          <CardHeader>
            <CardTitle className="text-barbershop-text">{t('analytics.clientMetrics.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="text-barbershop-gold h-6 w-6 mr-2" />
                </div>
                <p className="text-3xl font-bold text-barbershop-gold">{totalClients}</p>
                <p className="text-barbershop-muted">{t('analytics.clientMetrics.totalClients')}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="text-barbershop-gold h-6 w-6 mr-2" />
                </div>
                <p className="text-3xl font-bold text-barbershop-gold">{formatCurrency(avgSpendPerVisit)}</p>
                <p className="text-barbershop-muted">{t('analytics.clientMetrics.avgSpendPerVisit')}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="text-barbershop-gold h-6 w-6 mr-2" />
                </div>
                <p className="text-3xl font-bold text-barbershop-gold">{avgVisitFrequency.toFixed(1)}</p>
                <p className="text-barbershop-muted">{t('analytics.clientMetrics.avgVisitFrequency')}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="text-barbershop-gold h-6 w-6 mr-2" />
                </div>
                <p className="text-3xl font-bold text-barbershop-gold">{formatCurrency(totalLifetimeValue)}</p>
                <p className="text-barbershop-muted">{t('analytics.clientMetrics.lifetimeValue')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Trends */}
        <div className="mb-8">
          <Card className="barbershop-card border-barbershop-dark">
            <CardHeader>
              <CardTitle className="text-barbershop-text">{t('analytics.charts.revenueTrends')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                      formatter={(value: any, name: string) => [
                        name === 'revenue' ? formatCurrency(value) : value,
                        name === 'revenue' ? 'Revenue' : 'Appointments'
                      ]}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#7BB3F0" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Analytics & Peak Hours */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card className="barbershop-card border-barbershop-dark">
            <CardHeader>
              <CardTitle className="text-barbershop-text">{t('analytics.charts.servicePopularity')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={serviceChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {serviceChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="barbershop-card border-barbershop-dark">
            <CardHeader>
              <CardTitle className="text-barbershop-text">{t('analytics.charts.peakHours')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="hour" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="appointments" fill="#7BB3F0" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Management */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-barbershop-text mb-4">{t('analytics.inventory.title')}</h2>
          
          {/* Low Stock Alerts */}
          {lowStockProducts.length > 0 && (
            <Card className="barbershop-card border-barbershop-dark">
              <CardHeader>
                <CardTitle className="text-barbershop-text flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                  {t('analytics.inventory.lowStockAlerts')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockProducts.map((product) => (
                    <div key={product._id} className="flex justify-between items-center p-3 barbershop-dark rounded">
                      <div>
                        <h4 className="font-medium text-barbershop-text">{product.name}</h4>
                        <p className="text-sm text-barbershop-muted">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive">
                          {product.currentStock} / {product.minStockThreshold}
                        </Badge>
                        <p className="text-sm text-barbershop-muted mt-1">
                          {t('analytics.inventory.cost')}: {formatCurrency(product.costPerUnit)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Service Cost Analysis */}
          <Card className="barbershop-card border-barbershop-dark">
            <CardHeader>
              <CardTitle className="text-barbershop-text">{t('analytics.inventory.profitability')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profitMargins.map((service) => (
                  <div key={service.service} className="p-4 barbershop-dark rounded">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-barbershop-text">{getServiceName(service.service)}</h4>
                      <Badge className={service.margin > 70 ? "bg-green-500" : service.margin > 50 ? "bg-yellow-500" : "bg-red-500"}>
                        {formatMargin(service.margin)} {t('analytics.inventory.margin')}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-barbershop-muted">{t('analytics.inventory.productCost')}</p>
                        <p className="text-barbershop-text font-medium">{formatCurrency(service.cost)}</p>
                      </div>
                      <div>
                        <p className="text-barbershop-muted">{t('analytics.inventory.servicePrice')}</p>
                        <p className="text-barbershop-text font-medium">{formatCurrency(service.price)}</p>
                      </div>
                      <div>
                        <p className="text-barbershop-muted">{t('analytics.inventory.profit')}</p>
                        <p className="text-barbershop-text font-medium">{formatCurrency(service.profit)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Summary */}
        <Card className="barbershop-card border-barbershop-dark">
          <CardHeader>
            <CardTitle className="text-barbershop-text">
              {t('analytics.businessSummary.title')} ({t(`analytics.dateRanges.${dateRange}`)})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-barbershop-gold">{formatCurrency(totalRevenue)}</p>
                <p className="text-barbershop-muted">{t('analytics.businessSummary.totalRevenue')}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-barbershop-gold">{totalAppointments}</p>
                <p className="text-barbershop-muted">{t('analytics.businessSummary.totalAppointments')}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-barbershop-gold">{formatCurrency(avgDailyRevenue)}</p>
                <p className="text-barbershop-muted">{t('analytics.businessSummary.avgDailyRevenue')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}