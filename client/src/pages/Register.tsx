import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { insertRegistrationSchema, type InsertRegistration } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BoltIcon, RocketLaunchIcon, SparklesIcon } from "@heroicons/react/24/outline";

export default function Register() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<InsertRegistration>({
    resolver: zodResolver(insertRegistrationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const registration = useMutation({
    mutationFn: async (data: InsertRegistration) => {
      const res = await apiRequest("POST", "/api/register", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Registration successful!",
        description: "Thank you for registering. You'll be able to book your sessions soon.",
      });
      navigate(`/checkout?registrationId=${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Illustrations */}
      <div className="relative overflow-hidden bg-primary/5 py-16">
        <div className="absolute inset-0" style={{ opacity: 0.1 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit-pattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 25 0 L 25 50 M 0 25 L 50 25" stroke="currentColor" strokeWidth="0.5" fill="none"/>
                <circle cx="25" cy="25" r="3" fill="currentColor"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit-pattern)"/>
          </svg>
        </div>

        {/* Floating Icons */}
        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
          <BoltIcon className="w-16 h-16 text-primary opacity-20 animate-pulse" />
        </div>
        <div className="absolute top-3/4 right-1/4 transform translate-x-1/2 -translate-y-1/2">
          <RocketLaunchIcon className="w-12 h-12 text-primary opacity-20 animate-bounce" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 transform -translate-x-1/2">
          <SparklesIcon className="w-10 h-10 text-primary opacity-20 animate-pulse" />
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Join Our AI Bootcamp</h1>
            <p className="text-lg text-muted-foreground">
              Start your journey into the future of technology. Learn AI from industry experts
              and become part of our growing community of innovators.
            </p>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-card p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-6">Register Now</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => registration.mutate(data))} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={registration.isPending}
              >
                {registration.isPending ? "Registering..." : "Register Now"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}