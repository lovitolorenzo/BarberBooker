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

interface RevenueData {
  date: string;
  revenue: number;
  appointments: number;
  services: { [key: string]: number };
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');

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

  // Service popularity
  const serviceStats = appointments.reduce((acc, appointment) => {
    const service = appointment.service;
    acc[service] = (acc[service] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const serviceChartData = Object.entries(serviceStats).map(([service, count]) => ({
    name: services[service as ServiceKey]?.name || service,
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
    const servicePrice = services[serviceType as ServiceKey]?.price * 100 || 0;
    const profit = servicePrice - cost;
    const margin = ((profit / servicePrice) * 100).toFixed(1);
    return {
      service: services[serviceType as ServiceKey]?.name || serviceType,
      cost: cost / 100,
      price: servicePrice / 100,
      profit: profit / 100,
      margin: parseFloat(margin)
    };
  });

  const COLORS = ['#7BB3F0', '#4A90E2', '#2E5BBA', '#1E3A8A', '#0F172A'];

  const formatCurrency = (amount: number) => `$${(amount / 100).toFixed(2)}`;

  return (
    <div className="min-h-screen barbershop-bg text-barbershop-text">
      {/* Header */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Range Selector */}
        <div className="flex space-x-2 mb-8">
          {[
            { key: '7d', label: '7 Days' },
            { key: '30d', label: '30 Days' },
            { key: '90d', label: '90 Days' }
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={dateRange === key ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange(key as any)}
              className={dateRange === key 
                ? "barbershop-gold text-white" 
                : "barbershop-dark text-barbershop-text border-barbershop-charcoal hover:barbershop-charcoal"
              }
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Client Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-barbershop-text mb-4">Client Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="barbershop-card border-barbershop-dark">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="text-barbershop-gold h-5 w-5" />
                  <div>
                    <p className="text-barbershop-muted text-sm">Total Clients</p>
                    <p className="text-2xl font-bold text-barbershop-text">{totalClients}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="barbershop-card border-barbershop-dark">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="text-barbershop-gold h-5 w-5" />
                  <div>
                    <p className="text-barbershop-muted text-sm">Avg Spend/Visit</p>
                    <p className="text-2xl font-bold text-barbershop-text">{formatCurrency(avgSpendPerVisit)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="barbershop-card border-barbershop-dark">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="text-barbershop-gold h-5 w-5" />
                  <div>
                    <p className="text-barbershop-muted text-sm">Avg Visit Frequency</p>
                    <p className="text-2xl font-bold text-barbershop-text">{avgVisitFrequency.toFixed(1)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="barbershop-card border-barbershop-dark">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="text-barbershop-gold h-5 w-5" />
                  <div>
                    <p className="text-barbershop-muted text-sm">Lifetime Value</p>
                    <p className="text-2xl font-bold text-barbershop-text">{formatCurrency(totalLifetimeValue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Revenue Trends */}
        <div className="mb-8">
          <Card className="barbershop-card border-barbershop-dark">
            <CardHeader>
              <CardTitle className="text-barbershop-text">Revenue Trends</CardTitle>
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
              <CardTitle className="text-barbershop-text">Service Popularity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
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
              <CardTitle className="text-barbershop-text">Peak Hours Analysis</CardTitle>
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
          <h2 className="text-xl font-semibold text-barbershop-text mb-4">Inventory Management</h2>
          
          {/* Low Stock Alerts */}
          {lowStockProducts.length > 0 && (
            <Card className="barbershop-card border-red-500 mb-6">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Low Stock Alerts</span>
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
                          Cost: {formatCurrency(product.costPerUnit)}
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
              <CardTitle className="text-barbershop-text">Service Profitability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profitMargins.map((service) => (
                  <div key={service.service} className="p-4 barbershop-dark rounded">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-barbershop-text">{service.service}</h4>
                      <Badge className={service.margin > 70 ? "bg-green-500" : service.margin > 50 ? "bg-yellow-500" : "bg-red-500"}>
                        {service.margin}% margin
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-barbershop-muted">Product Cost</p>
                        <p className="text-barbershop-text font-medium">${service.cost.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-barbershop-muted">Service Price</p>
                        <p className="text-barbershop-text font-medium">${service.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-barbershop-muted">Profit</p>
                        <p className="text-barbershop-text font-medium">${service.profit.toFixed(2)}</p>
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
            <CardTitle className="text-barbershop-text">Business Summary ({dateRange})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-barbershop-gold">{formatCurrency(totalRevenue)}</p>
                <p className="text-barbershop-muted">Total Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-barbershop-gold">{totalAppointments}</p>
                <p className="text-barbershop-muted">Total Appointments</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-barbershop-gold">{formatCurrency(avgDailyRevenue)}</p>
                <p className="text-barbershop-muted">Avg Daily Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}