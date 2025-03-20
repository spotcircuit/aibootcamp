
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Hero() {
  const [, navigate] = useLocation();
  
  return (
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            <span className="block">AI Boot Camp</span>
            <span className="block text-primary mt-2">Learn how to build your own AI tools in 2 hours!</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Join our comprehensive bootcamp where we will build an AI Recruiter and Analyst and learn how to create our own AI Avatars.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" onClick={() => navigate("/register")}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
