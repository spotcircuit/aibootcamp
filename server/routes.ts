import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { userAuthSchema } from "@shared/schema";
import { db } from "./db";
import { events } from "@shared/schema";

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

  app.post("/api/register", async (req, res) => {
    try {
      const data = userAuthSchema.parse(req.body);
      const user = await storage.createUser(data);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
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

  const httpServer = createServer(app);
  return httpServer;
}