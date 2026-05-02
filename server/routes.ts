import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertAppointmentSchema,
  insertBusinessHoursConfigSchema,
  insertServiceConfigSchema,
  updateServiceConfigSchema,
} from "@shared/schema";
import { z } from "zod";

const parseTimeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const formatMinutesToTime = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const generateTimeSlots = (openTime: string, closeTime: string, slotIntervalMinutes: number) => {
  const slots: string[] = [];
  const openMinutes = parseTimeToMinutes(openTime);
  const closeMinutes = parseTimeToMinutes(closeTime);

  for (let current = openMinutes; current < closeMinutes; current += slotIntervalMinutes) {
    slots.push(formatMinutesToTime(current));
  }

  return slots;
};

const getEndOfCurrentWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilSaturday = dayOfWeek === 0 ? 6 : 6 - dayOfWeek;
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + daysUntilSaturday);
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek;
};

export async function registerRoutes(app: Express): Promise<Server> {
  const getSessionUser = (req: Request) => (req as any).session?.user as
    | { id?: string; role?: string; email?: string; firstName?: string; lastName?: string }
    | undefined;

  const requireStaff = (req: Request, res: Response, next: NextFunction) => {
    const user = getSessionUser(req);
    if (!user || (user.role !== "admin" && user.role !== "barber")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = getSessionUser(req);
    if (!user || user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  app.get("/api/services", async (_req, res) => {
    try {
      const services = await storage.getServiceConfigs({ includeDisabled: false });
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get("/api/admin/services", requireAdmin, async (_req, res) => {
    try {
      const services = await storage.getServiceConfigs({ includeDisabled: true });
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.post("/api/admin/services", requireAdmin, async (req, res) => {
    try {
      const validated = insertServiceConfigSchema.parse(req.body);
      const created = await storage.createServiceConfig(validated);
      res.status(201).json(created);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid service config", errors: error.errors });
      }
      res.status(400).json({ message: error?.message || "Failed to create service" });
    }
  });

  app.put("/api/admin/services/:key", requireAdmin, async (req, res) => {
    try {
      const { key } = req.params;
      const validated = updateServiceConfigSchema.parse(req.body);
      const updated = await storage.updateServiceConfig(key, validated);
      if (!updated) return res.status(404).json({ message: "Service not found" });
      res.json(updated);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid service config", errors: error.errors });
      }
      res.status(400).json({ message: error?.message || "Failed to update service" });
    }
  });

  app.delete("/api/admin/services/:key", requireAdmin, async (req, res) => {
    try {
      const { key } = req.params;
      const deleted = await storage.deleteServiceConfig(key);
      if (!deleted) return res.status(404).json({ message: "Service not found" });
      res.json({ message: "Service deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  app.get("/api/business-hours", async (_req, res) => {
    try {
      const config = await storage.getBusinessHoursConfig("default");
      res.json(config);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business hours" });
    }
  });

  app.get("/api/admin/business-hours", requireAdmin, async (_req, res) => {
    try {
      const config = await storage.getBusinessHoursConfig("default");
      res.json(config);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business hours" });
    }
  });

  app.put("/api/admin/business-hours", requireAdmin, async (req, res) => {
    try {
      const validated = insertBusinessHoursConfigSchema.parse({
        ...req.body,
        key: "default",
      });
      const updated = await storage.upsertBusinessHoursConfig("default", validated);
      res.json(updated);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid business hours config", errors: error.errors });
      }
      res.status(400).json({ message: error?.message || "Failed to update business hours" });
    }
  });

  // Get appointments for a specific date
  app.get("/api/appointments/date/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const appointments = await storage.getAppointmentsByDate(date);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  // Get appointments for a date range
  app.get("/api/appointments/range", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "startDate and endDate are required" });
      }

      const appointments = await storage.getAppointmentsByDateRange(
        startDate as string,
        endDate as string
      );
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  // Create a new appointment
  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const sessionUser = getSessionUser(req);

      const businessHours = await storage.getBusinessHoursConfig("default");
      if (!businessHours) {
        return res.status(500).json({ message: "Business hours are not configured" });
      }

      const appointmentDate = new Date(`${validatedData.appointmentDate}T00:00:00`);
      const bookingWindowEnd = getEndOfCurrentWeek();
      const isAdmin = sessionUser?.role === "admin";

      if (!isAdmin && appointmentDate.getTime() > bookingWindowEnd.getTime()) {
        return res.status(400).json({ message: "You can only book appointments until the end of the current week" });
      }

      if (!isAdmin && !validatedData.customerPhone) {
        return res.status(400).json({ message: "Phone number is required" });
      }

      const businessDay = businessHours.days.find((day) => day.dayOfWeek === appointmentDate.getDay());

      if (!businessDay || !businessDay.enabled) {
        return res.status(400).json({ message: "The shop is closed on the selected day" });
      }

      const allowedSlots = generateTimeSlots(
        businessDay.openTime,
        businessDay.closeTime,
        businessHours.slotIntervalMinutes
      );

      if (!allowedSlots.includes(validatedData.appointmentTime)) {
        return res.status(400).json({ message: "The selected time is outside business hours" });
      }

      if (validatedData.serviceKey) {
        const service = await storage.getServiceConfigByKey(validatedData.serviceKey);
        if (!service || !service.enabled) {
          return res.status(400).json({ message: "Invalid service" });
        }
        validatedData.service = service.name;
        validatedData.duration = service.duration;
        validatedData.price = service.price;
      }
      
      // Check if the time slot is already booked
      const existingAppointments = await storage.getAppointmentsByDate(validatedData.appointmentDate);
      const isSlotTaken = existingAppointments.some(
        appointment => 
          appointment.appointmentTime === validatedData.appointmentTime &&
          appointment.status === "confirmed"
      );

      if (isSlotTaken) {
        return res.status(409).json({ message: "This time slot is already booked" });
      }

      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid appointment data",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });

  // Get all appointments (admin only)
  app.get("/api/appointments/all", requireStaff, async (_req, res) => {
    try {
      const appointments = await storage.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/clients", requireStaff, async (_req, res) => {
    try {
      const clients = await storage.getAllClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  app.get("/api/analytics/products", requireStaff, async (_req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/analytics/products/low-stock", requireStaff, async (_req, res) => {
    try {
      const lowStockProducts = await storage.getLowStockProducts();
      res.json(lowStockProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch low stock products" });
    }
  });

  app.get("/api/analytics/service-products", requireStaff, async (_req, res) => {
    try {
      const serviceProducts = await storage.getAllServiceProducts();
      res.json(serviceProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service products" });
    }
  });

  app.get("/api/analytics/revenue/:startDate/:endDate", requireStaff, async (req, res) => {
    try {
      const { startDate, endDate } = req.params;
      const appointments = await storage.getAppointmentsByDateRange(startDate, endDate);
      
      const revenueData = appointments.reduce((acc, appointment) => {
        const date = appointment.appointmentDate;
        if (!acc[date]) {
          acc[date] = {
            date,
            revenue: 0,
            appointments: 0,
            services: {}
          };
        }
        
        acc[date].revenue += appointment.price;
        acc[date].appointments += 1;
        const serviceKeyOrName = (appointment as any).serviceKey || appointment.service;
        acc[date].services[serviceKeyOrName] = (acc[date].services[serviceKeyOrName] || 0) + 1;
        
        return acc;
      }, {} as any);

      res.json(Object.values(revenueData));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch revenue data" });
    }
  });

  // Health check endpoint for deployment
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { firstName, lastName, password } = req.body;
      
      console.log("Login attempt:", { firstName, lastName, passwordLength: password?.length });
      
      if (!firstName || !lastName || !password) {
        return res.status(400).json({ message: "First name, last name and password are required" });
      }

      // Find user by first and last name
      const user = await storage.getUserByName(firstName, lastName);
      
      console.log("User found:", user ? "YES" : "NO");
      if (user) {
        console.log("User details:", { 
          id: user.id, 
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email, 
          role: user.role,
          hasPassword: !!(user as any).password
        });
      }
      
      if (!user) {
        return res.status(401).json({ message: "Invalid name or password" });
      }

      // In production, this would use proper password hashing (bcrypt)
      // For demo purposes, we're doing simple string comparison
      const userPassword = (user as any).password;
      console.log("Password comparison:", { 
        provided: password, 
        stored: userPassword, 
        match: userPassword === password 
      });
      
      if (userPassword !== password) {
        return res.status(401).json({ message: "Invalid name or password" });
      }

      // Return user info (excluding password)
      const userResponse = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: (user as any).phone,
        role: user.role
      };

      const session = (req as any).session;
      session.user = userResponse;

      await new Promise<void>((resolve, reject) => {
        session.save((saveError: any) => {
          if (saveError) {
            reject(saveError);
            return;
          }

          resolve();
        });
      });

      console.log("Login successful for:", `${firstName} ${lastName}`);
      res.json({ 
        message: "Login successful", 
        user: userResponse 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { firstName, lastName, password, phone } = req.body;
      
      if (!firstName || !lastName || !password || !phone) {
        return res.status(400).json({ message: "First name, last name, phone and password are required" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }

      // Check if user already exists by name
      const existingUserByName = await storage.getUserByName(firstName, lastName);
      if (existingUserByName) {
        return res.status(409).json({ message: "A user with this name already exists" });
      }

      // Create new user
      const newUser = await storage.createUser({
        id: `customer-${Date.now()}`, // Generate unique ID
        firstName,
        lastName,
        phone,
        password, // In production, this should be hashed
        role: "customer", // Default role for new registrations
      });

      // Return success (don't return password)
      const userResponse = {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: (newUser as any).phone,
        role: newUser.role
      };

      res.status(201).json({ 
        message: "Registration successful", 
        user: userResponse 
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.get("/api/auth/me", (req, res) => {
    const sessionUser = (req as any).session?.user;

    if (!sessionUser) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    res.json({ user: sessionUser });
  });

  app.post("/api/auth/logout", (req, res) => {
    const sessionObj = (req as any).session;
    if (!sessionObj) {
      return res.json({ message: "Logged out" });
    }

    sessionObj.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out" });
    });
  });

  // Debug endpoint to check database status
  app.get("/api/debug/db-status", async (req, res) => {
    try {
      const db = storage.getDatabase();
      
      // List all collections
      const collections = await db.listCollections().toArray();
      
      // Count documents in each collection
      const collectionStats = await Promise.all(
        collections.map(async (col: any) => {
          const count = await db.collection(col.name).countDocuments();
          return { name: col.name, count };
        })
      );
      
      res.json({
        database: db.databaseName,
        collections: collectionStats,
        totalCollections: collections.length
      });
    } catch (error: any) {
      console.error("Database debug error:", error);
      res.status(500).json({ message: "Failed to get database status", error: error.message });
    }
  });

  // Test endpoint to seed users (for development only)
  app.post("/api/test/seed-users", async (req, res) => {
    try {
      const count = await storage.seedSampleUsers();
      res.json({ message: "Users seeded successfully", count });
    } catch (error) {
      console.error("Seeding error:", error);
      res.status(500).json({ message: "Failed to seed users" });
    }
  });

  // Create admin user endpoint
  app.post("/api/admin/create-admin-user", async (req, res) => {
    try {
      // Check if admin already exists
      const existingAdmin = await storage.getUserByName('Lorenzo', 'Lovito');
      
      if (existingAdmin) {
        return res.status(409).json({ 
          message: "Admin user already exists",
          user: {
            firstName: existingAdmin.firstName,
            lastName: existingAdmin.lastName,
            role: existingAdmin.role
          }
        });
      }
      
      // Create admin user
      const adminUser = await storage.createUser({
        id: `admin-${Date.now()}`,
        firstName: 'Lorenzo',
        lastName: 'Lovito',
        email: 'lovitolorenzo23@gmail.com',
        phone: '',
        password: 'Yogurt25!',
        role: 'admin'
      });
      
      res.status(201).json({ 
        message: "Admin user created successfully",
        user: {
          firstName: adminUser.firstName,
          lastName: adminUser.lastName,
          email: adminUser.email,
          role: adminUser.role
        }
      });
    } catch (error) {
      console.error("Error creating admin user:", error);
      res.status(500).json({ message: "Failed to create admin user" });
    }
  });

  // Get a specific appointment
  app.get("/api/appointments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const appointment = await storage.getAppointment(id);
      
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointment" });
    }
  });

  // Update an appointment
  app.patch("/api/appointments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertAppointmentSchema.partial().parse(req.body);
      
      const appointment = await storage.updateAppointment(id, updateData);
      
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      res.json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid appointment data",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update appointment" });
    }
  });

  // Delete an appointment
  app.delete("/api/appointments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteAppointment(id);
      res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete appointment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
