import { pgTable, text, serial, numeric, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Events table for bootcamp sessions
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  capacity: numeric("capacity").notNull(),
  price: numeric("price").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Modified registrations table with nullable foreign keys
export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  userId: numeric("user_id").references(() => users.id), // Made nullable
  eventId: numeric("event_id").references(() => events.id), // Made nullable
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  amount: numeric("amount"), // Already nullable
  stripePaymentId: text("stripe_payment_id"),
  emailSent: text("email_sent").default("false"),
  isPaid: boolean("is_paid").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema for user login
export const userLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Schema for user registration/login
export const userAuthSchema = createInsertSchema(users)
  .pick({
    email: true,
    password: true,
    name: true,
  })
  .extend({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

// Schema for registration
export const insertRegistrationSchema = createInsertSchema(registrations)
  .pick({
    name: true,
    email: true,
    phone: true,
  })
  .extend({
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
  });

// Export types
export type InsertUser = z.infer<typeof userAuthSchema>;
export type LoginUser = z.infer<typeof userLoginSchema>;
export type User = typeof users.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;