import { pgTable, text, serial, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  amount: numeric("amount").notNull(),
  stripePaymentId: text("stripe_payment_id"),
  emailSent: text("email_sent").default("false"),
});

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

export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrations.$inferSelect;
