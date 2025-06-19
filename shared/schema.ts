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

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;



// Service definitions
export const services = {
  haircut: { name: 'Haircut', duration: 30, price: 25 },
  beard: { name: 'Beard Trim', duration: 15, price: 15 },
  full: { name: 'Full Service', duration: 45, price: 35 }
} as const;

export type ServiceKey = keyof typeof services;
