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

      {/* What is AI Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What is AI?
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-lg border bg-card">
                <img 
                  src="/image_1742408574966.png" 
                  alt="AI Capabilities" 
                  className="w-full"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-3">Real World Applications</h3>
                  <p className="text-muted-foreground">
                    From writing books to automating tasks, AI tools are revolutionizing how we work. The AI Recruiter demonstrates how AI can transform specific industries with practical applications.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li>• From blank page to print copy in 2 weeks</li>
                    <li>• 9 Chapters approximately 74,000 words</li>
                    <li>• Includes a prompt "cheat sheet"</li>
                    <li>• Copy/paste prompt templates for immediate use</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="overflow-hidden rounded-lg border bg-card">
                <img 
                  src="/image_1742408591793.png" 
                  alt="AI Evolution" 
                  className="w-full"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-3">Rapid Evolution</h3>
                  <p className="text-muted-foreground">
                    Experience the incredible evolution of AI technology from GPT-3 to GPT-4 and beyond. Learn how each iteration brings new capabilities and opportunities for innovation in your field.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

        {/* AI Impact Section */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              The Impact of AI Today
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="overflow-hidden rounded-lg border bg-card">
                  <img 
                    src="/image_1742408440211.png" 
                    alt="DeepMind's Breakthrough" 
                    className="w-full"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-3">Revolutionary Breakthroughs</h3>
                    <p className="text-muted-foreground">
                      From solving protein folding to advancing drug development, AI is transforming scientific discovery and pushing the boundaries of what's possible.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="overflow-hidden rounded-lg border bg-card">
                  <img 
                    src="/image_1742408487798.png" 
                    alt="AI Text Generation Scale" 
                    className="w-full"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-3">Massive Scale Impact</h3>
                    <p className="text-muted-foreground">
                      AI language models are processing and generating content at unprecedented scales, revolutionizing how we interact with and create information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Economic Impact Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              The impact of AI on the Economy
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="overflow-hidden rounded-lg border bg-card">
                <img 
                  src="/image_1742408641990.png" 
                  alt="AI Economic Impact" 
                  className="w-full"
                />
                <div className="p-6">
                  <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div>
                      <h3 className="text-4xl font-bold text-primary mb-2">1B+</h3>
                      <p className="text-muted-foreground">ChatGPT web visits in the first two months</p>
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold text-primary mb-2">$900B</h3>
                      <p className="text-muted-foreground">Global revenue from AI software by 2026</p>
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold text-primary mb-2">$15.7T</h3>
                      <p className="text-muted-foreground">Potential contribution to global economy by 2030</p>
                    </div>
                  </div>
                  <p className="mt-6 text-center text-muted-foreground">
                    AI has the potential to deliver additional global economic activity of around $13 trillion by 2030, 
                    representing about 16 percent higher cumulative GDP compared with today.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Discussion and Ethics Section */}
        <section className="py-20 bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl font-bold mb-6 text-white">Understanding AI</h2>
                <ul className="space-y-4 text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="font-semibold">What IS AI?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-semibold">How does an LLM work?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-semibold">What are some of the things LLMs are for?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-semibold">What don't we understand about AI?</span>
                  </li>
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <img 
                  src="/image_1742408666665.png" 
                  alt="AI Discussion Topics" 
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Ethical Considerations Section */}
        <section className="py-20 bg-gradient-to-b from-background to-muted">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="/image_1742408738311.png" 
                  alt="AI Ethics Question" 
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-6">Responsible AI Development</h2>
                <p className="text-lg mb-6 text-muted-foreground">
                  As we advance in AI technology, it's crucial to consider not just what we can do, 
                  but what we should do. Our course emphasizes ethical considerations and responsible 
                  development practices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Historical Context Section */}
        <section className="py-20 bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl font-bold mb-6 text-white">The Evolution of AI</h2>
                <p className="text-lg mb-6 text-slate-300">
                  From Alan Turing's foundational work to modern developments by leaders like Sam Altman, 
                  we explore how AI has evolved and where it's heading. Understand the ethical use of AI 
                  in technical applications and its impact on various industries.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <img 
                  src="/image_1742408756740.png" 
                  alt="AI History and Evolution" 
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Instructor Section */}
        <section className="py-20 bg-muted/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Meet Your Instructor
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-8 items-center bg-card rounded-lg p-8 border">
                <div className="w-full md:w-1/2">
                  <img 
                    src="/image_1742408546572.png" 
                    alt="Dr. Allan D Thompson" 
                    className="rounded-lg w-full"
                  />
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                  <h3 className="text-2xl font-bold">DR. ALLAN D THOMPSON</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <span>Harvard Certified Coach</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <span>Former head of Mensa International (responsible for working with child prodigies)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <span>Author of more than 20 books on human and artificial intelligence</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <span>Conducted more than 50 interviews with GPT</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
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