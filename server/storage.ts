import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import { type Appointment, type MongoAppointment, type InsertAppointment, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  // Appointment operations
  getAppointment(id: string): Promise<Appointment | undefined>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  getAppointmentsByDateRange(startDate: string, endDate: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: string): Promise<boolean>;
  getAllAppointments(): Promise<Appointment[]>;
  
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
}

export class MongoStorage implements IStorage {
  private client: MongoClient;
  private db: Db;
  private appointments: Collection<MongoAppointment>;
  private users: Collection<User>;

  constructor() {
    const connectionString = process.env.MONGODB_URI || "mongodb://localhost:27017";
    this.client = new MongoClient(connectionString);
    this.db = this.client.db("barbershop");
    this.appointments = this.db.collection<MongoAppointment>("appointments");
    this.users = this.db.collection<User>("users");
    this.connect();
  }

  private async connect() {
    try {
      await this.client.connect();
      console.log("Connected to MongoDB");
      await this.seedMockData();
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
    }
  }

  private async seedMockData() {
    const count = await this.appointments.countDocuments();
    if (count > 0) return; // Already seeded

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);

    const mockAppointments: Omit<MongoAppointment, '_id'>[] = [
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
        status: "confirmed",
        createdAt: new Date()
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
        status: "confirmed",
        createdAt: new Date()
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
        status: "confirmed",
        createdAt: new Date()
      }
    ];

    await this.appointments.insertMany(mockAppointments);
    console.log("MongoDB seeded with mock appointments");
  }

  private convertToAppointment(doc: MongoAppointment): Appointment {
    return {
      ...doc,
      _id: doc._id?.toString()
    };
  }

  // Appointment operations
  async getAppointment(id: string): Promise<Appointment | undefined> {
    try {
      const result = await this.appointments.findOne({ _id: new ObjectId(id) } as any);
      return result ? this.convertToAppointment(result) : undefined;
    } catch (error) {
      console.error("Error getting appointment:", error);
      return undefined;
    }
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    try {
      const results = await this.appointments.find({ appointmentDate: date }).toArray();
      return results.map(doc => this.convertToAppointment(doc));
    } catch (error) {
      console.error("Error getting appointments by date:", error);
      return [];
    }
  }

  async getAppointmentsByDateRange(startDate: string, endDate: string): Promise<Appointment[]> {
    try {
      const results = await this.appointments.find({
        appointmentDate: { $gte: startDate, $lte: endDate }
      }).toArray();
      return results.map(doc => this.convertToAppointment(doc));
    } catch (error) {
      console.error("Error getting appointments by date range:", error);
      return [];
    }
  }

  async getAllAppointments(): Promise<Appointment[]> {
    try {
      const results = await this.appointments.find({}).toArray();
      return results.map(doc => this.convertToAppointment(doc));
    } catch (error) {
      console.error("Error getting all appointments:", error);
      return [];
    }
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    try {
      const appointmentDoc: Omit<MongoAppointment, '_id'> = {
        ...insertAppointment,
        createdAt: new Date()
      };
      const result = await this.appointments.insertOne(appointmentDoc);
      return this.convertToAppointment({
        ...appointmentDoc,
        _id: result.insertedId.toString()
      });
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  }

  async updateAppointment(id: string, updateData: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    try {
      const result = await this.appointments.findOneAndUpdate(
        { _id: new ObjectId(id) } as any,
        { $set: updateData },
        { returnDocument: 'after' }
      );
      return result ? this.convertToAppointment(result) : undefined;
    } catch (error) {
      console.error("Error updating appointment:", error);
      return undefined;
    }
  }

  async deleteAppointment(id: string): Promise<boolean> {
    try {
      const result = await this.appointments.deleteOne({ _id: new ObjectId(id) } as any);
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting appointment:", error);
      return false;
    }
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    try {
      const user = await this.users.findOne({ id: id });
      return user || undefined;
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.users.findOne({ email: email });
      return user || undefined;
    } catch (error) {
      console.error("Error getting user by email:", error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const userDoc: Omit<User, '_id'> = {
        ...user,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await this.users.insertOne(userDoc);
      return {
        ...userDoc,
        _id: result.insertedId.toString()
      };
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User | undefined> {
    try {
      const result = await this.users.findOneAndUpdate(
        { id: id },
        { $set: { ...userData, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
      return result || undefined;
    } catch (error) {
      console.error("Error updating user:", error);
      return undefined;
    }
  }
}

export const storage = new MongoStorage();
