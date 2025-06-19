import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import { 
  type Appointment, 
  type MongoAppointment, 
  type InsertAppointment, 
  type User, 
  type InsertUser,
  type Client,
  type InsertClient,
  type Product,
  type InsertProduct,
  type ServiceProduct,
  type InsertServiceProduct,
  type AnalyticsData,
  type InsertAnalytics
} from "@shared/schema";

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

  // Client operations
  getClient(email: string): Promise<Client | undefined>;
  getAllClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(email: string, client: Partial<InsertClient>): Promise<Client | undefined>;

  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  getLowStockProducts(): Promise<Product[]>;

  // Service Product operations
  getServiceProducts(serviceType: string): Promise<ServiceProduct[]>;
  getAllServiceProducts(): Promise<ServiceProduct[]>;
  createServiceProduct(serviceProduct: InsertServiceProduct): Promise<ServiceProduct>;

  // Analytics operations
  getAnalyticsByDate(date: string): Promise<AnalyticsData | undefined>;
  getAnalyticsByDateRange(startDate: string, endDate: string): Promise<AnalyticsData[]>;
  createOrUpdateAnalytics(analytics: InsertAnalytics): Promise<AnalyticsData>;
}

export class MongoStorage implements IStorage {
  private client: MongoClient;
  private db: Db;
  private appointments: Collection<MongoAppointment>;
  private users: Collection<User>;
  private clients: Collection<Client>;
  private products: Collection<Product>;
  private serviceProducts: Collection<ServiceProduct>;
  private analytics: Collection<AnalyticsData>;

  constructor() {
    const connectionString = process.env.MONGODB_URI || "mongodb://localhost:27017";
    this.client = new MongoClient(connectionString);
    this.db = this.client.db("barbershop");
    this.appointments = this.db.collection<MongoAppointment>("appointments");
    this.users = this.db.collection<User>("users");
    this.clients = this.db.collection<Client>("clients");
    this.products = this.db.collection<Product>("products");
    this.serviceProducts = this.db.collection<ServiceProduct>("serviceProducts");
    this.analytics = this.db.collection<AnalyticsData>("analytics");
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

    // Seed appointments
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

    // Seed clients
    const mockClients: Omit<Client, '_id'>[] = [
      {
        email: "john.smith@email.com",
        firstName: "John",
        lastName: "Smith",
        phone: "(555) 123-4567",
        totalVisits: 5,
        totalSpent: 12500,
        lastVisit: tomorrow,
        firstVisit: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        preferredServices: ["haircut"],
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        email: "mike.johnson@email.com",
        firstName: "Mike",
        lastName: "Johnson",
        phone: "(555) 987-6543",
        totalVisits: 8,
        totalSpent: 28000,
        lastVisit: tomorrow,
        firstVisit: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
        preferredServices: ["full", "haircut"],
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    ];

    await this.clients.insertMany(mockClients);

    // Seed products
    const mockProducts: Omit<Product, '_id'>[] = [
      {
        name: "Premium Hair Shampoo",
        category: "Hair Care",
        currentStock: 25,
        minStockThreshold: 5,
        costPerUnit: 1200,
        supplier: "Beauty Supply Co",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Beard Oil",
        category: "Beard Care",
        currentStock: 3,
        minStockThreshold: 5,
        costPerUnit: 800,
        supplier: "Grooming Essentials",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Hair Styling Gel",
        category: "Hair Care",
        currentStock: 15,
        minStockThreshold: 8,
        costPerUnit: 600,
        supplier: "Style Masters",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const productResults = await this.products.insertMany(mockProducts);
    const productIds = productResults.insertedIds;

    // Seed service products
    const mockServiceProducts: Omit<ServiceProduct, '_id'>[] = [
      {
        serviceType: "haircut",
        productId: Object.values(productIds)[0].toString(),
        productName: "Premium Hair Shampoo",
        quantityUsed: 0.5,
        costPerService: 600
      },
      {
        serviceType: "haircut",
        productId: Object.values(productIds)[2].toString(),
        productName: "Hair Styling Gel",
        quantityUsed: 0.3,
        costPerService: 180
      },
      {
        serviceType: "beard",
        productId: Object.values(productIds)[1].toString(),
        productName: "Beard Oil",
        quantityUsed: 0.2,
        costPerService: 160
      },
      {
        serviceType: "full",
        productId: Object.values(productIds)[0].toString(),
        productName: "Premium Hair Shampoo",
        quantityUsed: 0.5,
        costPerService: 600
      },
      {
        serviceType: "full",
        productId: Object.values(productIds)[1].toString(),
        productName: "Beard Oil",
        quantityUsed: 0.2,
        costPerService: 160
      },
      {
        serviceType: "full",
        productId: Object.values(productIds)[2].toString(),
        productName: "Hair Styling Gel",
        quantityUsed: 0.3,
        costPerService: 180
      }
    ];

    await this.serviceProducts.insertMany(mockServiceProducts);

    console.log("MongoDB seeded with mock data including analytics components");
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

  // Client operations
  async getClient(email: string): Promise<Client | undefined> {
    try {
      const client = await this.clients.findOne({ email: email });
      return client || undefined;
    } catch (error) {
      console.error("Error getting client:", error);
      return undefined;
    }
  }

  async getAllClients(): Promise<Client[]> {
    try {
      return await this.clients.find({}).toArray();
    } catch (error) {
      console.error("Error getting all clients:", error);
      return [];
    }
  }

  async createClient(client: InsertClient): Promise<Client> {
    try {
      const clientDoc: Omit<Client, '_id'> = {
        ...client,
        lastVisit: new Date(),
        firstVisit: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await this.clients.insertOne(clientDoc);
      return {
        ...clientDoc,
        _id: result.insertedId.toString()
      };
    } catch (error) {
      console.error("Error creating client:", error);
      throw error;
    }
  }

  async updateClient(email: string, clientData: Partial<InsertClient>): Promise<Client | undefined> {
    try {
      const result = await this.clients.findOneAndUpdate(
        { email: email },
        { $set: { ...clientData, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
      return result || undefined;
    } catch (error) {
      console.error("Error updating client:", error);
      return undefined;
    }
  }

  // Product operations
  async getAllProducts(): Promise<Product[]> {
    try {
      return await this.products.find({}).toArray();
    } catch (error) {
      console.error("Error getting all products:", error);
      return [];
    }
  }

  async getProduct(id: string): Promise<Product | undefined> {
    try {
      const product = await this.products.findOne({ _id: new ObjectId(id) } as any);
      return product || undefined;
    } catch (error) {
      console.error("Error getting product:", error);
      return undefined;
    }
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    try {
      const productDoc: Omit<Product, '_id'> = {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await this.products.insertOne(productDoc);
      return {
        ...productDoc,
        _id: result.insertedId.toString()
      };
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async updateProduct(id: string, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    try {
      const result = await this.products.findOneAndUpdate(
        { _id: new ObjectId(id) } as any,
        { $set: { ...productData, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
      return result || undefined;
    } catch (error) {
      console.error("Error updating product:", error);
      return undefined;
    }
  }

  async getLowStockProducts(): Promise<Product[]> {
    try {
      return await this.products.find({
        $expr: { $lt: ["$currentStock", "$minStockThreshold"] }
      }).toArray();
    } catch (error) {
      console.error("Error getting low stock products:", error);
      return [];
    }
  }

  // Service Product operations
  async getServiceProducts(serviceType: string): Promise<ServiceProduct[]> {
    try {
      return await this.serviceProducts.find({ serviceType: serviceType }).toArray();
    } catch (error) {
      console.error("Error getting service products:", error);
      return [];
    }
  }

  async getAllServiceProducts(): Promise<ServiceProduct[]> {
    try {
      return await this.serviceProducts.find({}).toArray();
    } catch (error) {
      console.error("Error getting all service products:", error);
      return [];
    }
  }

  async createServiceProduct(serviceProduct: InsertServiceProduct): Promise<ServiceProduct> {
    try {
      const result = await this.serviceProducts.insertOne(serviceProduct);
      return {
        ...serviceProduct,
        _id: result.insertedId.toString()
      };
    } catch (error) {
      console.error("Error creating service product:", error);
      throw error;
    }
  }

  // Analytics operations
  async getAnalyticsByDate(date: string): Promise<AnalyticsData | undefined> {
    try {
      const analytics = await this.analytics.findOne({ date: date });
      return analytics || undefined;
    } catch (error) {
      console.error("Error getting analytics by date:", error);
      return undefined;
    }
  }

  async getAnalyticsByDateRange(startDate: string, endDate: string): Promise<AnalyticsData[]> {
    try {
      return await this.analytics.find({
        date: { $gte: startDate, $lte: endDate }
      }).toArray();
    } catch (error) {
      console.error("Error getting analytics by date range:", error);
      return [];
    }
  }

  async createOrUpdateAnalytics(analyticsData: InsertAnalytics): Promise<AnalyticsData> {
    try {
      const result = await this.analytics.findOneAndUpdate(
        { date: analyticsData.date },
        { 
          $set: { 
            ...analyticsData, 
            createdAt: new Date() 
          } 
        },
        { 
          upsert: true, 
          returnDocument: 'after' 
        }
      );
      return result!;
    } catch (error) {
      console.error("Error creating/updating analytics:", error);
      throw error;
    }
  }
}

export const storage = new MongoStorage();
