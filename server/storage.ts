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

    // Generate historical data for the past 90 days
    const historicalAppointments: Omit<MongoAppointment, '_id'>[] = [];
    const customerEmails = [
      "john.smith@email.com", "mike.johnson@email.com", "david.wilson@email.com",
      "sarah.connor@email.com", "emily.davis@email.com", "james.brown@email.com",
      "lisa.martinez@email.com", "robert.garcia@email.com", "maria.rodriguez@email.com",
      "william.taylor@email.com", "jennifer.anderson@email.com", "michael.thomas@email.com"
    ];
    
    const firstNames = ["John", "Mike", "David", "Sarah", "Emily", "James", "Lisa", "Robert", "Maria", "William", "Jennifer", "Michael"];
    const lastNames = ["Smith", "Johnson", "Wilson", "Connor", "Davis", "Brown", "Martinez", "Garcia", "Rodriguez", "Taylor", "Anderson", "Thomas"];
    const services = ["haircut", "beard", "full"];
    const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];
    const statuses = ["confirmed", "completed", "cancelled"];

    // Generate 90 days of historical data
    for (let daysAgo = 90; daysAgo >= 0; daysAgo--) {
      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() - daysAgo);
      const dateStr = appointmentDate.toISOString().split('T')[0];
      
      // Skip future dates for completed appointments
      const isToday = daysAgo === 0;
      const isFuture = daysAgo < 0;
      
      // Generate 3-8 appointments per day
      const appointmentsPerDay = Math.floor(Math.random() * 6) + 3;
      
      for (let i = 0; i < appointmentsPerDay; i++) {
        const customerIndex = Math.floor(Math.random() * customerEmails.length);
        const service = services[Math.floor(Math.random() * services.length)];
        const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
        
        let status = "completed";
        if (isToday || isFuture) {
          status = Math.random() < 0.9 ? "confirmed" : "cancelled";
        } else {
          // Historical appointments: 85% completed, 10% cancelled, 5% no-show
          const rand = Math.random();
          if (rand < 0.85) status = "completed";
          else if (rand < 0.95) status = "cancelled";
          else status = "no-show";
        }
        
        const servicePrice = service === "haircut" ? 2500 : service === "beard" ? 1500 : 3500;
        const duration = service === "haircut" ? 30 : service === "beard" ? 15 : 45;
        
        historicalAppointments.push({
          customerFirstName: firstNames[customerIndex],
          customerLastName: lastNames[customerIndex],
          customerEmail: customerEmails[customerIndex],
          customerPhone: `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
          service: service,
          appointmentDate: dateStr,
          appointmentTime: timeSlot,
          duration: duration,
          price: servicePrice,
          notes: Math.random() < 0.3 ? "Special request" : "",
          status: status,
          createdAt: new Date(appointmentDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        });
      }
    }

    // Add future appointments
    historicalAppointments.push(
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
      }
    );

    await this.appointments.insertMany(historicalAppointments);

    // Generate client profiles based on appointment history
    const clientProfiles = new Map();
    
    historicalAppointments.forEach(appointment => {
      const email = appointment.customerEmail;
      if (!clientProfiles.has(email)) {
        clientProfiles.set(email, {
          email,
          firstName: appointment.customerFirstName,
          lastName: appointment.customerLastName,
          phone: appointment.customerPhone,
          totalVisits: 0,
          totalSpent: 0,
          appointments: [],
          services: new Set()
        });
      }
      
      const profile = clientProfiles.get(email);
      if (appointment.status === "completed") {
        profile.totalVisits++;
        profile.totalSpent += appointment.price;
      }
      profile.appointments.push(appointment);
      profile.services.add(appointment.service);
    });

    const mockClients: Omit<Client, '_id'>[] = Array.from(clientProfiles.values()).map(profile => {
      const sortedAppointments = profile.appointments.sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
      const firstVisit = sortedAppointments[0] ? new Date(sortedAppointments[0].appointmentDate) : new Date();
      const lastVisit = sortedAppointments[sortedAppointments.length - 1] ? new Date(sortedAppointments[sortedAppointments.length - 1].appointmentDate) : new Date();
      
      return {
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        totalVisits: profile.totalVisits,
        totalSpent: profile.totalSpent,
        lastVisit,
        firstVisit,
        preferredServices: Array.from(profile.services),
        createdAt: firstVisit,
        updatedAt: new Date()
      };
    });

    await this.clients.insertMany(mockClients);

    // Seed products with realistic inventory levels
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
      },
      {
        name: "Aftershave Lotion",
        category: "Skin Care",
        currentStock: 2,
        minStockThreshold: 4,
        costPerUnit: 950,
        supplier: "Grooming Essentials",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Hair Conditioner",
        category: "Hair Care",
        currentStock: 12,
        minStockThreshold: 6,
        costPerUnit: 1100,
        supplier: "Beauty Supply Co",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Razor Blades",
        category: "Tools",
        currentStock: 1,
        minStockThreshold: 10,
        costPerUnit: 250,
        supplier: "Sharp Edge Supply",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Beard Balm",
        category: "Beard Care",
        currentStock: 8,
        minStockThreshold: 3,
        costPerUnit: 1050,
        supplier: "Grooming Essentials",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Hair Wax",
        category: "Hair Care",
        currentStock: 20,
        minStockThreshold: 7,
        costPerUnit: 750,
        supplier: "Style Masters",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const productResults = await this.products.insertMany(mockProducts);
    const productIds = productResults.insertedIds;

    // Seed service products with realistic usage patterns
    const productIdArray = Object.values(productIds);
    const mockServiceProducts: Omit<ServiceProduct, '_id'>[] = [
      // Haircut service products
      {
        serviceType: "haircut",
        productId: productIdArray[0].toString(),
        productName: "Premium Hair Shampoo",
        quantityUsed: 0.5,
        costPerService: 600
      },
      {
        serviceType: "haircut",
        productId: productIdArray[2].toString(),
        productName: "Hair Styling Gel",
        quantityUsed: 0.3,
        costPerService: 180
      },
      {
        serviceType: "haircut",
        productId: productIdArray[4].toString(),
        productName: "Hair Conditioner",
        quantityUsed: 0.3,
        costPerService: 330
      },
      // Beard service products
      {
        serviceType: "beard",
        productId: productIdArray[1].toString(),
        productName: "Beard Oil",
        quantityUsed: 0.2,
        costPerService: 160
      },
      {
        serviceType: "beard",
        productId: productIdArray[3].toString(),
        productName: "Aftershave Lotion",
        quantityUsed: 0.1,
        costPerService: 95
      },
      {
        serviceType: "beard",
        productId: productIdArray[6].toString(),
        productName: "Beard Balm",
        quantityUsed: 0.15,
        costPerService: 158
      },
      // Full service products
      {
        serviceType: "full",
        productId: productIdArray[0].toString(),
        productName: "Premium Hair Shampoo",
        quantityUsed: 0.5,
        costPerService: 600
      },
      {
        serviceType: "full",
        productId: productIdArray[1].toString(),
        productName: "Beard Oil",
        quantityUsed: 0.2,
        costPerService: 160
      },
      {
        serviceType: "full",
        productId: productIdArray[2].toString(),
        productName: "Hair Styling Gel",
        quantityUsed: 0.3,
        costPerService: 180
      },
      {
        serviceType: "full",
        productId: productIdArray[3].toString(),
        productName: "Aftershave Lotion",
        quantityUsed: 0.1,
        costPerService: 95
      },
      {
        serviceType: "full",
        productId: productIdArray[4].toString(),
        productName: "Hair Conditioner",
        quantityUsed: 0.3,
        costPerService: 330
      },
      {
        serviceType: "full",
        productId: productIdArray[6].toString(),
        productName: "Beard Balm",
        quantityUsed: 0.15,
        costPerService: 158
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
