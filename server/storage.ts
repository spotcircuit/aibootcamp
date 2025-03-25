import { type Registration, type User, type InsertUser } from "@shared/schema";
import { pool, supabase } from "./db";
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
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('id', id)
      .single();
      
    if (error) {
      console.error("Error fetching user:", error);
      return undefined;
    }
    
    return data;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('email', email)
      .single();
      
    if (error) {
      console.error("Error fetching user by email:", error);
      return undefined;
    }
    
    return data;
  }

  async validateUserPassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select()
      .eq('email', userData.email)
      .single();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const { data, error } = await supabase
      .from('users')
      .insert({
        ...userData,
        password: hashedPassword,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async createRegistration(data: Registration): Promise<Registration> {
    const { data: registration, error } = await supabase
      .from('registrations')
      .insert(data)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return registration;
  }

  async getRegistrations(): Promise<Registration[]> {
    const { data, error } = await supabase
      .from('registrations')
      .select();
      
    if (error) {
      throw error;
    }
    
    return data || [];
  }

  async updatePaymentStatus(id: number, paymentId: string): Promise<Registration> {
    const { data, error } = await supabase
      .from('registrations')
      .update({ 
        stripePaymentId: paymentId,
        isPaid: true,
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    if (!data) {
      throw new Error("Registration not found");
    }
    
    return data;
  }

  async updateEmailStatus(id: number): Promise<Registration> {
    const { data, error } = await supabase
      .from('registrations')
      .update({ emailSent: "true" })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    if (!data) {
      throw new Error("Registration not found");
    }
    
    return data;
  }
}

export const storage = new PostgresStorage();