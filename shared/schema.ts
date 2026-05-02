import { z } from "zod";

// MongoDB document interfaces
export interface MongoAppointment {
  _id?: any;
  customerFirstName: string;
  customerLastName: string;
  customerEmail?: string;
  customerPhone?: string;
  serviceKey?: string;
  service: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  price: number;
  notes?: string;
  status?: string;
  bookedBy?: string;
  createdAt: Date;
}

export interface Appointment {
  _id?: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail?: string;
  customerPhone?: string;
  serviceKey?: string;
  service: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  price: number;
  notes?: string;
  status?: string;
  bookedBy?: string;
  createdAt: Date;
}

export interface User {
  _id?: string;
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  password?: string;
  profileImageUrl?: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit: Date;
  firstVisit: Date;
  preferredServices: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  _id?: string;
  name: string;
  category: string;
  currentStock: number;
  minStockThreshold: number;
  costPerUnit: number;
  supplier?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceProduct {
  _id?: string;
  serviceType: string;
  productId: string;
  productName: string;
  quantityUsed: number;
  costPerService: number;
}

export interface ServiceConfig {
  _id?: string;
  key: string;
  name: string;
  duration: number;
  price: number;
  enabled: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessHoursDay {
  dayOfWeek: number;
  enabled: boolean;
  openTime: string;
  closeTime: string;
}

export interface BusinessHoursConfig {
  _id?: string;
  key: string;
  slotIntervalMinutes: number;
  days: BusinessHoursDay[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalyticsData {
  _id?: string;
  date: string;
  dailyRevenue: number;
  appointmentCount: number;
  noShowCount: number;
  serviceBreakdown: { [service: string]: number };
  hourlyBookings: { [hour: string]: number };
  createdAt: Date;
}

// Zod schemas for validation
export const insertAppointmentSchema = z.object({
  customerFirstName: z.string().min(1, "First name is required"),
  customerLastName: z.string().min(1, "Last name is required"),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().min(1, "Phone number is required").optional(),
  serviceKey: z.string().min(1).optional(),
  service: z.string().min(1, "Service selection is required"),
  appointmentDate: z.string().min(1, "Date is required"),
  appointmentTime: z.string().min(1, "Time is required"),
  duration: z.number().min(1, "Duration must be positive"),
  price: z.number().min(1, "Price must be positive"),
  notes: z.string().optional(),
  status: z.string().optional(),
  bookedBy: z.string().optional(),
});

export const insertUserSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().optional(), // Add password field
  profileImageUrl: z.string().optional(),
  role: z.string().optional(),
});

export const insertClientSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
  totalVisits: z.number().min(0).default(0),
  totalSpent: z.number().min(0).default(0),
  preferredServices: z.array(z.string()).default([]),
});

export const insertProductSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  currentStock: z.number().min(0),
  minStockThreshold: z.number().min(0),
  costPerUnit: z.number().min(0),
  supplier: z.string().optional(),
});

export const insertServiceProductSchema = z.object({
  serviceType: z.string().min(1),
  productId: z.string().min(1),
  productName: z.string().min(1),
  quantityUsed: z.number().min(0),
  costPerService: z.number().min(0),
});

export const insertServiceConfigSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  duration: z.number().int().min(1),
  price: z.number().int().min(0),
  enabled: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const updateServiceConfigSchema = insertServiceConfigSchema.partial().extend({
  key: z.string().min(1).optional(),
});

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const businessHoursDaySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  enabled: z.boolean().default(true),
  openTime: z.string().regex(timeRegex),
  closeTime: z.string().regex(timeRegex),
});

export const insertBusinessHoursConfigSchema = z.object({
  key: z.string().default("default"),
  slotIntervalMinutes: z.number().int().min(5).max(120).default(30),
  days: z.array(businessHoursDaySchema).length(7),
});

export const updateBusinessHoursConfigSchema = insertBusinessHoursConfigSchema.partial().extend({
  key: z.string().optional(),
  days: z.array(businessHoursDaySchema).length(7).optional(),
});

export const insertAnalyticsSchema = z.object({
  date: z.string(),
  dailyRevenue: z.number().min(0),
  appointmentCount: z.number().min(0),
  noShowCount: z.number().min(0),
  serviceBreakdown: z.record(z.number()),
  hourlyBookings: z.record(z.number()),
});

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertServiceProduct = z.infer<typeof insertServiceProductSchema>;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type InsertServiceConfig = z.infer<typeof insertServiceConfigSchema>;
export type UpdateServiceConfig = z.infer<typeof updateServiceConfigSchema>;
export type InsertBusinessHoursConfig = z.infer<typeof insertBusinessHoursConfigSchema>;
export type UpdateBusinessHoursConfig = z.infer<typeof updateBusinessHoursConfigSchema>;

export const defaultBusinessHoursDays: BusinessHoursDay[] = [
  { dayOfWeek: 0, enabled: true, openTime: "10:00", closeTime: "16:00" },
  { dayOfWeek: 1, enabled: true, openTime: "09:00", closeTime: "18:00" },
  { dayOfWeek: 2, enabled: true, openTime: "09:00", closeTime: "18:00" },
  { dayOfWeek: 3, enabled: true, openTime: "09:00", closeTime: "18:00" },
  { dayOfWeek: 4, enabled: true, openTime: "09:00", closeTime: "18:00" },
  { dayOfWeek: 5, enabled: true, openTime: "09:00", closeTime: "18:00" },
  { dayOfWeek: 6, enabled: true, openTime: "09:00", closeTime: "17:00" },
];

export const defaultSlotIntervalMinutes = 30;

// Service definitions
export const services = {
  haircut: { name: 'Haircut', duration: 30, price: 12 },
  beard: { name: 'Beard', duration: 10, price: 4 },
  full: { name: 'Haircut + Shampoo', duration: 35, price: 14 }
} as const;

export type ServiceKey = keyof typeof services;
