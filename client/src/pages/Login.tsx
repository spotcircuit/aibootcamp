import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { KeyIcon, UserIcon } from "@heroicons/react/24/outline";

export default function Login() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<LoginUser>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = useMutation({
    mutationFn: async (data: LoginUser) => {
      const res = await apiRequest("POST", "/api/login", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Login successful!",
        description: "Welcome back to AI Basics Bootcamp!",
      });
      navigate("/");
    },
    onError: (error) => {
      toast({
        title: "Login failed",
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
              <pattern id="key-pattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M25 0 L25 50 M0 25 L50 25" stroke="currentColor" strokeWidth="0.5" fill="none"/>
                <circle cx="25" cy="25" r="3" fill="currentColor"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#key-pattern)"/>
          </svg>
        </div>

        {/* Floating Icons */}
        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
          <KeyIcon className="w-16 h-16 text-primary opacity-20 animate-pulse" />
        </div>
        <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2">
          <UserIcon className="w-12 h-12 text-primary opacity-20" />
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
            <p className="text-lg text-muted-foreground">
              Log in to access your AI Bootcamp dashboard and continue your learning journey.
            </p>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-card p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => login.mutate(data))} className="space-y-6">
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
                disabled={login.isPending}
              >
                {login.isPending ? "Logging in..." : "Login"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <p>Don't have an account? <a href="/register" className="text-primary hover:underline">Register here</a></p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
