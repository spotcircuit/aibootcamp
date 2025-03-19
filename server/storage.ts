import { type Registration, type InsertRegistration } from "@shared/schema";

export interface IStorage {
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  getRegistrations(): Promise<Registration[]>;
  updatePaymentStatus(id: number, paymentId: string): Promise<Registration>;
  updateEmailStatus(id: number): Promise<Registration>;
}

export class MemStorage implements IStorage {
  private registrations: Map<number, Registration>;
  private currentId: number;

  constructor() {
    this.registrations = new Map();
    this.currentId = 1;
  }

  async createRegistration(data: InsertRegistration): Promise<Registration> {
    const id = this.currentId++;
    const registration: Registration = {
      id,
      ...data,
      phone: data.phone || null,
      amount: "299.99",
      stripePaymentId: null,
      emailSent: "false",
    };
    this.registrations.set(id, registration);
    return registration;
  }

  async getRegistrations(): Promise<Registration[]> {
    return Array.from(this.registrations.values());
  }

  async updatePaymentStatus(id: number, paymentId: string): Promise<Registration> {
    const registration = this.registrations.get(id);
    if (!registration) {
      throw new Error("Registration not found");
    }
    const updated = { ...registration, stripePaymentId: paymentId };
    this.registrations.set(id, updated);
    return updated;
  }

  async updateEmailStatus(id: number): Promise<Registration> {
    const registration = this.registrations.get(id);
    if (!registration) {
      throw new Error("Registration not found");
    }
    const updated = { ...registration, emailSent: "true" };
    this.registrations.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();