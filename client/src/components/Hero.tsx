import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Hero() {
  const [, navigate] = useLocation();

  return (
    <div className="relative bg-background overflow-hidden">
      {/* AI Grid Background */}
      <div className="absolute inset-0 z-0" style={{ opacity: 0.1 }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
            <pattern id="ai-circles" x="10" y="10" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1"/>
              <circle cx="50" cy="50" r="10" fill="currentColor"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
          <rect width="100%" height="100%" fill="url(#ai-circles)"/>

          {/* Animated AI "Neurons" */}
          <g className="animate-pulse">
            <circle cx="20%" cy="30%" r="5" fill="hsl(230, 84%, 51%)" opacity="0.5"/>
            <circle cx="80%" cy="60%" r="8" fill="hsl(230, 84%, 51%)" opacity="0.3"/>
            <circle cx="40%" cy="80%" r="6" fill="hsl(230, 84%, 51%)" opacity="0.4"/>
          </g>
        </svg>
      </div>

      <div className="container mx-auto px-4 py-24 sm:py-32 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            <span className="block">Master AI Fundamentals</span>
            <span className="block text-primary mt-2">in Just 12 Weeks</span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-xl text-muted-foreground">
            Join our comprehensive bootcamp and learn the foundations of Artificial Intelligence
            from industry experts. Perfect for beginners and intermediate learners.
          </p>

          <div className="mt-10 flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate("/register")}
            >
              Register Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const element = document.querySelector("#testimonials");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              See Testimonials
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="bg-background/50 backdrop-blur-sm p-4 rounded-lg">
              <p className="text-4xl font-bold text-primary">12</p>
              <p className="mt-2 text-muted-foreground">Weeks</p>
            </div>
            <div className="bg-background/50 backdrop-blur-sm p-4 rounded-lg">
              <p className="text-4xl font-bold text-primary">24</p>
              <p className="mt-2 text-muted-foreground">Live Sessions</p>
            </div>
            <div className="bg-background/50 backdrop-blur-sm p-4 rounded-lg">
              <p className="text-4xl font-bold text-primary">100+</p>
              <p className="mt-2 text-muted-foreground">Exercises</p>
            </div>
            <div className="bg-background/50 backdrop-blur-sm p-4 rounded-lg">
              <p className="text-4xl font-bold text-primary">1:1</p>
              <p className="mt-2 text-muted-foreground">Mentoring</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}