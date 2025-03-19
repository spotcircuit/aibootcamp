import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Hero() {
  const [, navigate] = useLocation();

  return (
    <div className="relative bg-background">
      <div className="container mx-auto px-4 py-24 sm:py-32">
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
            <div>
              <p className="text-4xl font-bold text-primary">12</p>
              <p className="mt-2 text-muted-foreground">Weeks</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">24</p>
              <p className="mt-2 text-muted-foreground">Live Sessions</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">100+</p>
              <p className="mt-2 text-muted-foreground">Exercises</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">1:1</p>
              <p className="mt-2 text-muted-foreground">Mentoring</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
