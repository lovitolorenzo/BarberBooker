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

  // Development method to seed sample users
  seedSampleUsers(): Promise<number>;

  // Get database instance for debugging
  getDatabase(): any;
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
    console.log("🌱 Starting comprehensive database seeding...");
    
    // Clear all collections first
    await Promise.all([
      this.appointments.deleteMany({}),
      this.users.deleteMany({}),
      this.clients.deleteMany({}),
      this.products.deleteMany({}),
      this.serviceProducts.deleteMany({}),
      this.analytics.deleteMany({})
    ]);
    console.log("🗑️ Database cleared");
    
    // 1. Seed Users (with passwords for authentication)
    const users = [
      {
        id: "admin-001",
        email: "admin@barbershop.com",
        password: "admin123", // Plain text for demo
        firstName: "Admin",
        lastName: "User",
        profileImageUrl: "",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "barber-001",
        email: "marco@barbershop.com", 
        password: "barber123",
        firstName: "Marco",
        lastName: "Rodriguez",
        profileImageUrl: "",
        role: "barber",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "customer-001",
        email: "john.smith@email.com",
        password: "customer123", 
        firstName: "John",
        lastName: "Smith",
        profileImageUrl: "",
        role: "customer",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "customer-002",
        email: "mike.johnson@email.com",
        password: "mike2024",
        firstName: "Mike", 
        lastName: "Johnson",
        profileImageUrl: "",
        role: "customer",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await this.users.insertMany(users);
    console.log("✅ Users seeded");

    // 2. Seed Products
    const products = [
      {
        name: "Premium Hair Shampoo",
        category: "Hair Care",
        currentStock: 50,
        minStockThreshold: 10,
        costPerUnit: 12.50,
        supplier: "Professional Hair Co.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Hair Styling Gel",
        category: "Styling",
        currentStock: 30,
        minStockThreshold: 5,
        costPerUnit: 8.75,
        supplier: "Style Master Inc.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Beard Oil",
        category: "Beard Care",
        currentStock: 25,
        minStockThreshold: 8,
        costPerUnit: 15.00,
        supplier: "Beard Bros Ltd.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Hair Conditioner",
        category: "Hair Care", 
        currentStock: 40,
        minStockThreshold: 12,
        costPerUnit: 10.25,
        supplier: "Professional Hair Co.",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await this.products.insertMany(products);
    console.log("✅ Products seeded");

    // 3. Seed Service Products (linking services to products)
    const serviceProducts = [
      {
        serviceType: "Haircut",
        productId: "shampoo-001",
        productName: "Premium Hair Shampoo",
        quantityUsed: 0.1,
        costPerService: 1.25
      },
      {
        serviceType: "Haircut", 
        productId: "gel-001",
        productName: "Hair Styling Gel",
        quantityUsed: 0.05,
        costPerService: 0.44
      },
      {
        serviceType: "Beard Trim",
        productId: "beard-oil-001", 
        productName: "Beard Oil",
        quantityUsed: 0.02,
        costPerService: 0.30
      },
      {
        serviceType: "Hair Wash",
        productId: "shampoo-001",
        productName: "Premium Hair Shampoo", 
        quantityUsed: 0.15,
        costPerService: 1.88
      },
      {
        serviceType: "Hair Wash",
        productId: "conditioner-001",
        productName: "Hair Conditioner",
        quantityUsed: 0.1,
        costPerService: 1.03
      }
    ];
    await this.serviceProducts.insertMany(serviceProducts);
    console.log("✅ Service Products seeded");

    // 4. Seed Appointments (90 days of data)
    const appointments = [];
    const services = ["Haircut", "Beard Trim", "Hair Wash", "Full Service", "Mustache Trim"];
    const servicePrices = { "Haircut": 25, "Beard Trim": 15, "Hair Wash": 10, "Full Service": 45, "Mustache Trim": 8 };
    const statuses = ["confirmed", "completed", "cancelled", "no-show"];
    const customerNames = [
      { first: "John", last: "Smith", email: "john.smith@email.com", phone: "+1234567890" },
      { first: "Mike", last: "Johnson", email: "mike.johnson@email.com", phone: "+1234567891" },
      { first: "David", last: "Brown", email: "david.brown@email.com", phone: "+1234567892" },
      { first: "James", last: "Wilson", email: "james.wilson@email.com", phone: "+1234567893" },
      { first: "Robert", last: "Davis", email: "robert.davis@email.com", phone: "+1234567894" },
      { first: "William", last: "Miller", email: "william.miller@email.com", phone: "+1234567895" },
      { first: "Richard", last: "Moore", email: "richard.moore@email.com", phone: "+1234567896" },
      { first: "Joseph", last: "Taylor", email: "joseph.taylor@email.com", phone: "+1234567897" },
      { first: "Thomas", last: "Anderson", email: "thomas.anderson@email.com", phone: "+1234567898" },
      { first: "Daniel", last: "Thomas", email: "daniel.thomas@email.com", phone: "+1234567899" }
    ];

    // Generate appointments for the last 90 days
    for (let i = 90; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Generate 3-8 appointments per day
      const dailyAppointments = Math.floor(Math.random() * 6) + 3;
      
      for (let j = 0; j < dailyAppointments; j++) {
        const customer = customerNames[Math.floor(Math.random() * customerNames.length)];
        const service = services[Math.floor(Math.random() * services.length)];
        const hour = Math.floor(Math.random() * 8) + 9; // 9 AM to 5 PM
        const minute = Math.random() > 0.5 ? "00" : "30";
        const status = i === 0 ? "confirmed" : statuses[Math.floor(Math.random() * statuses.length)];
        
        appointments.push({
          customerFirstName: customer.first,
          customerLastName: customer.last,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          service: service,
          appointmentDate: dateStr,
          appointmentTime: `${hour.toString().padStart(2, '0')}:${minute}`,
          duration: service === "Full Service" ? 90 : service === "Haircut" ? 45 : 30,
          price: servicePrices[service as keyof typeof servicePrices],
          notes: Math.random() > 0.7 ? "Regular customer" : "",
          status: status,
          bookedBy: "online",
          createdAt: new Date(date.getTime() - Math.random() * 24 * 60 * 60 * 1000)
        });
      }
    }
    
    await this.appointments.insertMany(appointments);
    console.log(`✅ ${appointments.length} Appointments seeded`);

    // 5. Generate Clients from appointment data
    const clientMap = new Map();
    appointments.forEach(apt => {
      const key = apt.customerEmail;
      if (!clientMap.has(key)) {
        clientMap.set(key, {
          email: apt.customerEmail,
          firstName: apt.customerFirstName,
          lastName: apt.customerLastName,
          phone: apt.customerPhone,
          totalVisits: 0,
          totalSpent: 0,
          appointments: []
        });
      }
      const client = clientMap.get(key);
      if (apt.status === "completed") {
        client.totalVisits++;
        client.totalSpent += apt.price;
      }
      client.appointments.push(apt);
    });

    const clients = Array.from(clientMap.values()).map(client => {
      const sortedApts = client.appointments.sort((a: any, b: any) => 
        new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
      );
      const services = [...new Set(client.appointments.map((apt: any) => apt.service))];
      
      return {
        email: client.email,
        firstName: client.firstName,
        lastName: client.lastName,
        phone: client.phone,
        totalVisits: client.totalVisits,
        totalSpent: client.totalSpent,
        lastVisit: new Date(sortedApts[sortedApts.length - 1].appointmentDate),
        firstVisit: new Date(sortedApts[0].appointmentDate),
        preferredServices: services,
        createdAt: new Date(sortedApts[0].appointmentDate),
        updatedAt: new Date()
      };
    });

    await this.clients.insertMany(clients);
    console.log(`✅ ${clients.length} Clients seeded`);

    // 6. Generate Analytics Data
    const analyticsData = [];
    const dateMap = new Map();
    
    appointments.forEach(apt => {
      if (!dateMap.has(apt.appointmentDate)) {
        dateMap.set(apt.appointmentDate, {
          revenue: 0,
          count: 0,
          noShows: 0,
          services: {},
          hours: {}
        });
      }
      const dayData = dateMap.get(apt.appointmentDate);
      
      if (apt.status === "completed") {
        dayData.revenue += apt.price;
      }
      dayData.count++;
      if (apt.status === "no-show") {
        dayData.noShows++;
      }
      
      dayData.services[apt.service] = (dayData.services[apt.service] || 0) + 1;
      const hour = apt.appointmentTime.split(':')[0];
      dayData.hours[hour] = (dayData.hours[hour] || 0) + 1;
    });

    Array.from(dateMap.entries()).forEach(([date, data]) => {
      analyticsData.push({
        date: date,
        dailyRevenue: data.revenue,
        appointmentCount: data.count,
        noShowCount: data.noShows,
        serviceBreakdown: data.services,
        hourlyBookings: data.hours,
        createdAt: new Date()
      });
    });

    await this.analytics.insertMany(analyticsData);
    console.log(`✅ ${analyticsData.length} Analytics records seeded`);
    
    console.log("🎉 Database seeding completed successfully!");
    console.log("📊 Summary:");
    console.log(`   - ${users.length} Users`);
    console.log(`   - ${products.length} Products`);
    console.log(`   - ${serviceProducts.length} Service Products`);
    console.log(`   - ${appointments.length} Appointments`);
    console.log(`   - ${clients.length} Clients`);
    console.log(`   - ${analyticsData.length} Analytics records`);
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
            updatedAt: new Date()
          }
        },
        { 
          upsert: true, 
          returnDocument: 'after'
        }
      );
      return result as AnalyticsData;
    } catch (error) {
      console.error("Error creating/updating analytics:", error);
      throw error;
    }
  }

  // Development method to seed sample users
  async seedSampleUsers(): Promise<number> {
    try {
      const sampleUsers = [
        {
          id: "admin-001",
          email: "admin@barbershop.com",
          password: "admin123",
          role: "admin",
          firstName: "Admin",
          lastName: "User",
          profileImageUrl: "",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "barber-001", 
          email: "marco@barbershop.com",
          password: "barber123",
          role: "barber",
          firstName: "Marco",
          lastName: "Rodriguez",
          profileImageUrl: "",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "customer-001",
          email: "john.smith@email.com",
          password: "customer123",
          role: "customer", 
          firstName: "John",
          lastName: "Smith",
          profileImageUrl: "",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "customer-002",
          email: "mike.johnson@email.com",
          password: "mike2024",
          role: "customer",
          firstName: "Mike", 
          lastName: "Johnson",
          profileImageUrl: "",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      // Clear existing users and insert new ones
      await this.users.deleteMany({});
      await this.users.insertMany(sampleUsers);
      
      return sampleUsers.length;
    } catch (error) {
      console.error("Error seeding users:", error);
      throw error;
    }
  }

  // Get database instance for debugging
  getDatabase(): any {
    return this.db;
  }
}

export const storage = new MongoStorage();
