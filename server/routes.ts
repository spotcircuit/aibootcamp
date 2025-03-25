import type { Express, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { Request } from "express";

// No need to redeclare here as it's declared in auth.ts
import Stripe from "stripe";
import { storage } from "./storage";
import { userAuthSchema, userLoginSchema, Image, Event, Registration } from "../shared/schema";
import { supabase, pool } from "./db";
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
  app.post('/api/upload', upload.single('image'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
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
      const { data, error } = await supabase.from('images').insert({
        filename: req.file.originalname,
        path: `images/uploads/${req.file.originalname}`,
      });

      if (error) {
        throw error;
      }

      // Clean up uploaded file
      fs.unlinkSync(req.file.path);

      if (data) {
        res.json(data[0]);
      } else {
        res.status(500).json({ message: "Failed to insert image data" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message || "An error occurred" });
    }
  });

  app.get("/api/images", async (_req: Request, res: Response) => {
    try {
      const { data, error } = await supabase.from('images').select();
      if (error) {
        throw error;
      }
      res.json(data || []);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "An error occurred" });
    }
  });

  app.delete("/api/images/:id", async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabase.from('images').select().eq('id', parseInt(req.params.id));
      if (error) {
        throw error;
      }

      if (!data || !data.length) {
        res.status(404).json({ message: "Image not found" });
        return;
      }

      await s3Client.send(new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: data[0].path,
      }));

      const { error: deleteError } = await supabase.from('images').delete().eq('id', parseInt(req.params.id));
      if (deleteError) {
        throw deleteError;
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "An error occurred" });
    }
  });

  app.get("/api/events", async (_req: Request, res: Response) => {
    try {
      const { data, error } = await supabase.from('events').select().order('startDate');
      if (error) {
        throw error;
      }
      res.json(data || []);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "An error occurred" });
    }
  });

  app.get("/api/registrations", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }
      const { data, error } = await supabase.from('registrations').select().eq('userId', req.user.id);
      if (error) {
        throw error;
      }
      res.json(data || []);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "An error occurred" });
    }
  });

  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      const data = userAuthSchema.parse(req.body);
      const user = await storage.createUser(data);

      // Log the user in after registration
      req.login(user, (err: Error | null) => {
        if (err) {
          res.status(500).json({ message: "Login failed after registration" });
          return;
        }
        res.json(user);
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Registration failed" });
    }
  });

  app.post("/api/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: Error | null, user: any, info: { message?: string }) => {
      if (err) {
        res.status(500).json({ message: err.message });
        return;
      }
      if (!user) {
        res.status(401).json({ message: info.message || "Invalid credentials" });
        return;
      }
      req.login(user, (loginErr: Error | null) => {
        if (loginErr) {
          res.status(500).json({ message: loginErr.message });
          return;
        }
        const { password, ...userData } = user;
        res.json(userData);
      });
    })(req, res, next);
  });

  app.post("/api/admin/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: Error | null, user: any, info: { message?: string }) => {
      if (err) {
        res.status(500).json({ message: err.message });
        return;
      }
      if (!user) {
        res.status(401).json({ message: info.message || "Invalid credentials" });
        return;
      }
      if (!user.isAdmin) {
        res.status(403).json({ message: "Access denied" });
        return;
      }
      req.login(user, (loginErr: Error | null) => {
        if (loginErr) {
          res.status(500).json({ message: loginErr.message });
          return;
        }
        const { password, ...userData } = user;
        res.json(userData);
      });
    })(req, res, next);
  });

  app.post("/api/logout", isAuthenticated, (req: Request, res: Response) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });

  app.post("/api/register-event", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }
      
      const { eventId } = req.body;
      const { data, error } = await supabase.from('events').select().eq('id', eventId);
      if (error) {
        throw error;
      }

      if (!data || !data.length) {
        res.status(404).json({ message: "Event not found" });
        return;
      }

      // Check if already registered
      const { data: existingRegistration, error: existingRegistrationError } = await supabase.from('registrations').select().eq('userId', req.user.id).eq('eventId', eventId);
      if (existingRegistrationError) {
        throw existingRegistrationError;
      }

      if (existingRegistration && existingRegistration.length && existingRegistration[0].isPaid) {
        res.status(400).json({ message: "Already registered for this event" });
        return;
      }

      // Create registration
      const { data: registrationData, error: registrationError } = await supabase.from('registrations').insert({
        userId: req.user.id,
        eventId: eventId,
        stripePaymentId: null,
        emailSent: "false",
        isPaid: false,
      }).select();
      if (registrationError) {
        throw registrationError;
      }

      if (!registrationData || registrationData.length === 0) {
        res.status(500).json({ message: "Failed to create registration" });
        return;
      }

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(Number(data[0].price) * 100), // Convert to cents
        currency: "usd",
        metadata: { registrationId: registrationData[0].id },
      });

      res.json({
        id: registrationData[0].id,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "An error occurred" });
    }
  });

  app.post("/api/confirm-payment", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { registrationId, paymentIntentId } = req.body;
      await storage.updatePaymentStatus(registrationId, paymentIntentId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "An error occurred" });
    }
  });

  app.post("/api/admin/events", isAdmin, async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabase.from('events').insert({
        name: req.body.name,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        capacity: req.body.capacity,
        price: req.body.price,
      }).select();
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        res.json(data[0]);
      } else {
        res.status(500).json({ message: "Failed to create event" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message || "An error occurred" });
    }
  });

  app.patch("/api/admin/events/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabase.from('events').update({
        name: req.body.name,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        capacity: req.body.capacity,
        price: req.body.price,
      }).eq('id', parseInt(req.params.id)).select();
      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        res.status(404).json({ message: "Event not found" });
        return;
      }

      res.json(data[0]);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "An error occurred" });
    }
  });

  app.get("/api/stripe-config", async (req: Request, res: Response) => {
    res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
  });


  const httpServer = createServer(app);
  return httpServer;
}