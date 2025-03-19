import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import { type Registration, type InsertRegistration, registrations } from "@shared/schema";
import { eq } from "drizzle-orm";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

export interface IStorage {
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  getRegistrations(): Promise<Registration[]>;
  updatePaymentStatus(id: number, paymentId: string): Promise<Registration>;
  updateEmailStatus(id: number): Promise<Registration>;
}

export class PostgresStorage implements IStorage {
  async createRegistration(data: InsertRegistration): Promise<Registration> {
    const [registration] = await db.insert(registrations)
      .values({
        ...data,
        phone: data.phone || null,
        amount: "299.99",
        stripePaymentId: null,
        emailSent: "false",
      })
      .returning();

    return registration;
  }

  async getRegistrations(): Promise<Registration[]> {
    return await db.select().from(registrations);
  }

  async updatePaymentStatus(id: number, paymentId: string): Promise<Registration> {
    const [registration] = await db
      .update(registrations)
      .set({ stripePaymentId: paymentId })
      .where(eq(registrations.id, id))
      .returning();

    if (!registration) {
      throw new Error("Registration not found");
    }

    return registration;
  }

  async updateEmailStatus(id: number): Promise<Registration> {
    const [registration] = await db
      .update(registrations)
      .set({ emailSent: "true" })
      .where(eq(registrations.id, id))
      .returning();

    if (!registration) {
      throw new Error("Registration not found");
    }

    return registration;
  }
}

// Export a single instance to be used throughout the application
export const storage = new PostgresStorage();