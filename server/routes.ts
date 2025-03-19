import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { userAuthSchema, userLoginSchema } from "@shared/schema";
import { db } from "./db";
import { events, registrations } from "@shared/schema";
import { and, eq } from "drizzle-orm";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/events", async (_req, res) => {
    try {
      const eventsList = await db.select().from(events).orderBy(events.startDate);
      res.json(eventsList);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/registrations", async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const userRegistrations = await db
        .select()
        .from(registrations)
        .where(eq(registrations.userId, req.user.id));

      res.json(userRegistrations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/register", async (req, res) => {
    try {
      const data = userAuthSchema.parse(req.body);
      const user = await storage.createUser(data);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const data = userLoginSchema.parse(req.body);
      const user = await storage.getUserByEmail(data.email);

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValid = await storage.validateUserPassword(user, data.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Send user data without password
      const { password, ...userData } = user;
      res.json(userData);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/admin/login", async (req, res) => {
    try {
      const data = userLoginSchema.parse(req.body);
      const user = await storage.getUserByEmail(data.email);

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValid = await storage.validateUserPassword(user, data.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!user.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Send user data without password
      const { password, ...userData } = user;
      res.json(userData);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/register-event", async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { eventId } = req.body;
      const [event] = await db.select().from(events).where(eq(events.id, eventId));

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if already registered
      const [existingRegistration] = await db
        .select()
        .from(registrations)
        .where(
          and(
            eq(registrations.userId, req.user.id),
            eq(registrations.eventId, eventId)
          )
        );

      if (existingRegistration?.isPaid) {
        return res.status(400).json({ message: "Already registered for this event" });
      }

      // Create registration
      const [registration] = await db
        .insert(registrations)
        .values({
          userId: req.user.id,
          eventId: eventId,
          stripePaymentId: null,
          emailSent: "false",
          isPaid: false,
        })
        .returning();

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(Number(event.price) * 100), // Convert to cents
        currency: "usd",
        metadata: { registrationId: registration.id },
      });

      res.json({
        id: registration.id,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/confirm-payment", async (req, res) => {
    try {
      const { registrationId, paymentIntentId } = req.body;
      await storage.updatePaymentStatus(registrationId, paymentIntentId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/events", async (req, res) => {
    try {
      if (!req.user?.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }

      const [event] = await db
        .insert(events)
        .values({
          name: req.body.name,
          startDate: new Date(req.body.startDate),
          endDate: new Date(req.body.endDate),
          capacity: req.body.capacity,
          price: req.body.price,
        })
        .returning();

      res.json(event);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}