import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User tables
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  role: text("role").notNull().default("customer"), // customer, admin
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  sid: text("sid").primaryKey(),
  sess: text("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Appointment table
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  customerFirstName: text("customer_first_name").notNull(),
  customerLastName: text("customer_last_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  service: text("service").notNull(),
  appointmentDate: text("appointment_date").notNull(), // YYYY-MM-DD format
  appointmentTime: text("appointment_time").notNull(), // HH:MM format
  duration: integer("duration").notNull(), // in minutes
  price: integer("price").notNull(), // in cents
  notes: text("notes"),
  status: text("status").notNull().default("confirmed"), // confirmed, cancelled, completed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  bookedBy: text("booked_by"), // user ID who booked (optional for walk-ins)
});

// Schema definitions
export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
  bookedBy: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;



// Service definitions
export const services = {
  haircut: { name: 'Haircut', duration: 30, price: 25 },
  beard: { name: 'Beard Trim', duration: 15, price: 15 },
  full: { name: 'Full Service', duration: 45, price: 35 }
} as const;

export type ServiceKey = keyof typeof services;
