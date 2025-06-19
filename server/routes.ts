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
