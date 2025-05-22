import { appointments, type Appointment, type InsertAppointment } from "@shared/schema";

export interface IStorage {
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  getAppointmentsByDateRange(startDate: string, endDate: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private appointments: Map<number, Appointment>;
  private currentId: number;

  constructor() {
    this.appointments = new Map();
    this.currentId = 1;
    
    // Pre-populate with some mock bookings for demonstration
    this.seedMockData();
  }

  private seedMockData() {
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

    mockAppointments.forEach(appointment => {
      this.createAppointment(appointment);
    });
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      appointment => appointment.appointmentDate === date
    );
  }

  async getAppointmentsByDateRange(startDate: string, endDate: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      appointment => 
        appointment.appointmentDate >= startDate && 
        appointment.appointmentDate <= endDate
    );
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.currentId++;
    const appointment: Appointment = {
      ...insertAppointment,
      id,
      createdAt: new Date()
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointment(id: number, updateData: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const existing = this.appointments.get(id);
    if (!existing) return undefined;

    const updated: Appointment = { ...existing, ...updateData };
    this.appointments.set(id, updated);
    return updated;
  }

  async deleteAppointment(id: number): Promise<boolean> {
    return this.appointments.delete(id);
  }
}

export const storage = new MemStorage();
