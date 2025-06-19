import { z } from "zod";

// MongoDB document interfaces
export interface MongoAppointment {
  _id?: any;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
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
  customerEmail: string;
  customerPhone: string;
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
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(1, "Phone number is required"),
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



// Service definitions
export const services = {
  haircut: { name: 'Haircut', duration: 30, price: 25 },
  beard: { name: 'Beard Trim', duration: 15, price: 15 },
  full: { name: 'Full Service', duration: 45, price: 35 }
} as const;

export type ServiceKey = keyof typeof services;
