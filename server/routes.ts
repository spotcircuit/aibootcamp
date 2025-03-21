import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { userAuthSchema, userLoginSchema, images } from "@shared/schema";
import { db } from "./db";
import { events, registrations } from "@shared/schema";
import { and, eq } from "drizzle-orm";
import { setupAuth, isAuthenticated, isAdmin } from "./auth";
import passport from 'passport';
import fs from 'fs';
import multer from 'multer';
import { s3Client, BUCKET_NAME } from './s3';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';


if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Image upload endpoint
  app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const fileStream = fs.createReadStream(req.file.path);
      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: `images/uploads/${req.file.originalname}`,
        Body: fileStream,
        ContentType: req.file.mimetype,
      };

      await s3Client.send(new PutObjectCommand(uploadParams));

      // Save to database
      const [image] = await db.insert(images).values({
        filename: req.file.originalname,
        path: `images/uploads/${req.file.originalname}`,
      }).returning();

      // Clean up uploaded file
      fs.unlinkSync(req.file.path);

      res.json(image);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/images", async (_req, res) => {
    try {
      const imagesList = await db.select().from(images);
      res.json(imagesList);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/images/:id", async (req, res) => {
    try {
      const [image] = await db.select().from(images).where(eq(images.id, parseInt(req.params.id)));

      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }

      await s3Client.send(new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: image.path,
      }));

      await db.delete(images).where(eq(images.id, parseInt(req.params.id)));

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/events", async (_req, res) => {
    try {
      const eventsList = await db.select().from(events).orderBy(events.startDate);
      res.json(eventsList);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/registrations", isAuthenticated, async (req, res) => {
    try {
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

      // Log the user in after registration
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login failed after registration" });
        }
        res.json(user);
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (!user) {
        return res.status(401).json({ message: info.message || "Invalid credentials" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ message: loginErr.message });
        }
        const { password, ...userData } = user;
        return res.json(userData);
      });
    })(req, res, next);
  });

  app.post("/api/admin/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (!user) {
        return res.status(401).json({ message: info.message || "Invalid credentials" });
      }
      if (!user.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ message: loginErr.message });
        }
        const { password, ...userData } = user;
        return res.json(userData);
      });
    })(req, res, next);
  });

  app.post("/api/logout", isAuthenticated, (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });

  app.post("/api/register-event", isAuthenticated, async (req, res) => {
    try {
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

  app.post("/api/confirm-payment", isAuthenticated, async (req, res) => {
    try {
      const { registrationId, paymentIntentId } = req.body;
      await storage.updatePaymentStatus(registrationId, paymentIntentId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/events", isAdmin, async (req, res) => {
    try {
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

  app.patch("/api/admin/events/:id", isAdmin, async (req, res) => {
    try {
      const [event] = await db
        .update(events)
        .set({
          name: req.body.name,
          startDate: new Date(req.body.startDate),
          endDate: new Date(req.body.endDate),
          capacity: req.body.capacity,
          price: req.body.price,
        })
        .where(eq(events.id, parseInt(req.params.id)))
        .returning();

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.json(event);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/stripe-config", async (c) => {
    return c.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
  });

  // Image routes
  app.get("/api/images", async (c) => {
    const allImages = await db.select().from(images);
    return c.json(allImages);
  });

  app.post("/api/upload", async (c) => {
    try {
      const formData = await c.req.formData();
      const file = formData.get("image") as any; // Type assertion needed here

      if (!file) {
        return c.json({ error: "No file provided" }, 400);
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const s3Path = `images/${file.name}`;

      await s3Client.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Path,
        Body: buffer,
        ContentType: file.type,
      }));

      const imageRecord = await db.insert(images).values({
        filename: file.name,
        path: s3Path,
      });

      return c.json({ success: true, image: imageRecord });
    } catch (error) {
      console.error("Upload error:", error);
      return c.json({ error: "Upload failed" }, 500);
    }
  });

  app.delete("/api/images/:id", async (c) => {
    const id = Number(c.req.param("id"));

    try {
      const image = await db.select().from(images).where(eq(images.id, id)).get();

      if (!image) {
        return c.json({ error: "Image not found" }, 404);
      }

      await s3Client.send(new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: image.path,
      }));

      await db.delete(images).where(eq(images.id, id));

      return c.json({ success: true });
    } catch (error) {
      console.error("Delete error:", error);
      return c.json({ error: "Delete failed" }, 500);
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}