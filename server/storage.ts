import { eq, and, gte, lte } from "drizzle-orm";
import { db } from "./db";
import { appointments, users, type Appointment, type InsertAppointment, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  // Appointment operations
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  getAppointmentsByDateRange(startDate: string, endDate: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;
  getAllAppointments(): Promise<Appointment[]>;
  
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.seedMockData();
  }

  private async seedMockData() {
    try {
      const existingAppointments = await db.select().from(appointments).limit(1);
      if (existingAppointments.length > 0) return; // Already seeded

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const dayAfter = new Date(today);
      dayAfter.setDate(today.getDate() + 2);

      const mockAppointments: InsertAppointment[] = [
        {
          customerFirstName: "John",
          customerLastName: "Smith",
          customerEmail: "john.smith@email.com",
          customerPhone: "(555) 123-4567",
          service: "haircut",
          appointmentDate: tomorrow.toISOString().split('T')[0],
          appointmentTime: "10:00",
          duration: 30,
          price: 2500,
          notes: "",
          status: "confirmed"
        },
        {
          customerFirstName: "Mike",
          customerLastName: "Johnson",
          customerEmail: "mike.johnson@email.com",
          customerPhone: "(555) 987-6543",
          service: "full",
          appointmentDate: tomorrow.toISOString().split('T')[0],
          appointmentTime: "14:30",
          duration: 45,
          price: 3500,
          notes: "Beard styling preferred",
          status: "confirmed"
        },
        {
          customerFirstName: "David",
          customerLastName: "Wilson",
          customerEmail: "david.wilson@email.com",
          customerPhone: "(555) 456-7890",
          service: "beard",
          appointmentDate: dayAfter.toISOString().split('T')[0],
          appointmentTime: "09:30",
          duration: 15,
          price: 1500,
          notes: "",
          status: "confirmed"
        }
      ];

      await db.insert(appointments).values(mockAppointments);
      console.log("Database seeded with mock appointments");
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  }

  // Appointment operations
  async getAppointment(id: number): Promise<Appointment | undefined> {
    try {
      const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
      return appointment;
    } catch (error) {
      console.error("Error getting appointment:", error);
      return undefined;
    }
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    try {
      return await db.select().from(appointments).where(eq(appointments.appointmentDate, date));
    } catch (error) {
      console.error("Error getting appointments by date:", error);
      return [];
    }
  }

  async getAppointmentsByDateRange(startDate: string, endDate: string): Promise<Appointment[]> {
    try {
      return await db.select().from(appointments).where(
        and(
          gte(appointments.appointmentDate, startDate),
          lte(appointments.appointmentDate, endDate)
        )
      );
    } catch (error) {
      console.error("Error getting appointments by date range:", error);
      return [];
    }
  }

  async getAllAppointments(): Promise<Appointment[]> {
    try {
      return await db.select().from(appointments);
    } catch (error) {
      console.error("Error getting all appointments:", error);
      return [];
    }
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    try {
      const [appointment] = await db.insert(appointments).values(insertAppointment).returning();
      return appointment;
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  }

  async updateAppointment(id: number, updateData: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    try {
      const [appointment] = await db.update(appointments)
        .set(updateData)
        .where(eq(appointments.id, id))
        .returning();
      return appointment;
    } catch (error) {
      console.error("Error updating appointment:", error);
      return undefined;
    }
  }

  async deleteAppointment(id: number): Promise<boolean> {
    try {
      const result = await db.delete(appointments).where(eq(appointments.id, id));
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting appointment:", error);
      return false;
    }
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user;
    } catch (error) {
      console.error("Error getting user by email:", error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const [newUser] = await db.insert(users).values(user).returning();
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User | undefined> {
    try {
      const [user] = await db.update(users)
        .set({...userData, updatedAt: new Date()})
        .where(eq(users.id, id))
        .returning();
      return user;
    } catch (error) {
      console.error("Error updating user:", error);
      return undefined;
    }
  }
}

export const storage = new DatabaseStorage();
