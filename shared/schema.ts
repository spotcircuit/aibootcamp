import { z } from "zod";

// Define schema for User
export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  isAdmin: boolean;
  createdAt: string;
}

// Define schema for Event
export interface Event {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  duration: string;
  capacity: number;
  price: number;
  contact: string;
  agenda: string;
  inclusions?: string;
  bonus?: string;
  createdAt: string;
}

// Define schema for Registration
export interface Registration {
  id: number;
  userId: number;
  eventId: number;
  stripePaymentId?: string;
  emailSent: string;
  isPaid: boolean;
  createdAt: string;
}

// Define schema for Image
export interface Image {
  id: number;
  filename: string;
  path: string;
  uploadedAt: string;
  eventId?: number;
}

// Schema for user login
export const userLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Schema for user registration
export const userAuthSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

// Export types
export type InsertUser = z.infer<typeof userAuthSchema>;
export type LoginUser = z.infer<typeof userLoginSchema>;