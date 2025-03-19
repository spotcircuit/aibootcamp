import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { userLoginSchema, type LoginUser } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function AdminLogin() {
  const [, navigate] = useLocation();

  const form = useForm<LoginUser>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = (data: LoginUser) => {
    // Temporarily skip authentication
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Shield Illustrations */}
      <div className="relative overflow-hidden bg-primary/5 py-16">
        <div className="absolute inset-0" style={{ opacity: 0.1 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="shield-pattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M25 0 L40 10 L40 40 L25 50 L10 40 L10 10 Z" stroke="currentColor" strokeWidth="0.5" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#shield-pattern)"/>
          </svg>
        </div>

        {/* Floating Icons */}
        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
          <ShieldCheckIcon className="w-16 h-16 text-primary opacity-20 animate-pulse" />
        </div>
        <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2">
          <KeyIcon className="w-12 h-12 text-primary opacity-20" />
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Administrator Login</h1>
            <p className="text-lg text-muted-foreground">
              Access the admin dashboard to manage events and settings.
            </p>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-card p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
              >
                Login
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}