import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAppointmentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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
  app.get("/api/appointments/all", async (req, res) => {
    try {
      // TODO: Add authentication check for admin role
      const appointments = await storage.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/clients", async (req, res) => {
    try {
      const clients = await storage.getAllClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  app.get("/api/analytics/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/analytics/products/low-stock", async (req, res) => {
    try {
      const lowStockProducts = await storage.getLowStockProducts();
      res.json(lowStockProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch low stock products" });
    }
  });

  app.get("/api/analytics/service-products", async (req, res) => {
    try {
      const serviceProducts = await storage.getAllServiceProducts();
      res.json(serviceProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service products" });
    }
  });

  app.get("/api/analytics/revenue/:startDate/:endDate", async (req, res) => {
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
        acc[date].services[appointment.service] = (acc[date].services[appointment.service] || 0) + 1;
        
        return acc;
      }, {} as any);

      res.json(Object.values(revenueData));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch revenue data" });
    }
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
        role: user.role
      };

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
      const { firstName, lastName, password } = req.body;
      
      if (!firstName || !lastName || !password) {
        return res.status(400).json({ message: "First name, last name and password are required" });
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
        password, // In production, this should be hashed
        role: "customer", // Default role for new registrations
      });

      // Return success (don't return password)
      const userResponse = {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
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
      const success = await storage.deleteAppointment(id);
      
      if (!success) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete appointment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
