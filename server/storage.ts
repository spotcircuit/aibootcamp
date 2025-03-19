import { type Registration, type User, type InsertUser, registrations, users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { db, pool } from "./db";
import bcrypt from "bcryptjs";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresStore = connectPg(session);

export interface IStorage {
  createRegistration(registration: Registration): Promise<Registration>;
  getRegistrations(): Promise<Registration[]>;
  updatePaymentStatus(id: number, paymentId: string): Promise<Registration>;
  updateEmailStatus(id: number): Promise<Registration>;
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
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

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async validateUserPassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
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

  async createRegistration(data: Registration): Promise<Registration> {
    const [registration] = await db.insert(registrations)
      .values(data)
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
}

export const storage = new PostgresStorage();