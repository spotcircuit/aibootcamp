import { type Registration, type InsertRegistration, type User, type InsertUser, registrations, users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { db, pool } from "./db";
import bcrypt from "bcryptjs";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresStore = connectPg(session);

export interface IStorage {
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  getRegistrations(): Promise<Registration[]>;
  updatePaymentStatus(id: number, paymentId: string): Promise<Registration>;
  updateEmailStatus(id: number): Promise<Registration>;
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  validateUserPassword(user: User, password: string): Promise<boolean>;
  sessionStore: session.Store;
}

export class PostgresStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async createRegistration(data: InsertRegistration): Promise<Registration> {
    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email));

    let userId = existingUser?.id;

    if (!userId) {
      // Create a temporary password that user will need to change
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      const [newUser] = await db.insert(users)
        .values({
          email: data.email,
          name: data.name,
          password: hashedPassword,
        })
        .returning();

      userId = newUser.id;
    }

    const [registration] = await db.insert(registrations)
      .values({
        ...data,
        userId,
        phone: data.phone || null,
        stripePaymentId: null,
        emailSent: "false",
        isPaid: false,
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
      .set({ 
        stripePaymentId: paymentId,
        isPaid: true,
      })
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

  async createUser(userData: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, userData.email));

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const [user] = await db.insert(users)
      .values({
        ...userData,
        password: hashedPassword,
      })
      .returning();

    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    return user;
  }

  async validateUserPassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }
}

export const storage = new PostgresStorage();