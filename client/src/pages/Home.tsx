import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import ToolsShowcase from "@/components/ToolsShowcase";
import EventCalendar from "@/components/EventCalendar";
import { useLocation } from "wouter";
import { Brain, Code, MessageSquare, Workflow, Lightbulb, Calendar, CheckCircle2 } from "lucide-react";

export default function Home() {
  const [, navigate] = useLocation();

  const modules = [
    {
      icon: <Brain className="w-8 h-8 text-primary" />,
      title: "AI Fundamentals",
      description: "Learn the core concepts of artificial intelligence and machine learning.",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-primary" />,
      title: "Prompt Engineering",
      description: "Master the art of crafting effective prompts for AI models.",
    },
    {
      icon: <Code className="w-8 h-8 text-primary" />,
      title: "AI Integration",
      description: "Implement AI solutions in real-world applications and systems.",
    },
    {
      icon: <Workflow className="w-8 h-8 text-primary" />,
      title: "AI Workflows",
      description: "Build efficient workflows combining multiple AI tools and services.",
    },
  ];

  const outcomes = [
    "Build and deploy AI-powered applications",
    "Create efficient workflows with AI tools",
    "Understand AI capabilities and limitations",
    "Make informed decisions about AI implementation",
    "Stay ahead of AI industry trends",
    "Network with AI professionals"
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />

      <main className="container mx-auto px-4">
        {/* What You'll Learn Section */}
        <section id="curriculum" className="py-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            What You'll Learn
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {modules.map((module) => (
              <div key={module.title} className="p-6 rounded-lg bg-card hover:shadow-lg transition-shadow">
                <div className="mb-4">{module.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{module.title}</h3>
                <p className="text-muted-foreground">{module.description}</p>
              </div>
            ))}
          </div>
        </section>

        <ToolsShowcase />

        {/* Schedule Section */}
        <section id="schedule" className="py-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Available Events
          </h2>
          <EventCalendar />
        </section>

        {/* Outcomes Section */}
        <section className="py-20 bg-muted/30 rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-12">
            Your Learning Outcomes
          </h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 px-4">
            {outcomes.map((outcome, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-lg">{outcome}</p>
              </div>
            ))}
          </div>
        </section>

        <Testimonials />

        <FAQ />

        <section className="text-center py-16">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your AI Journey?</h2>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => navigate("/register")}
          >
            Register Now
          </Button>
        </section>
      </main>

      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 AI Basics Bootcamp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}