import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import ToolsShowcase from "@/components/ToolsShowcase";
import EventCalendar from "@/components/EventCalendar";
import { useLocation } from "wouter";
import { LightBulbIcon, CodeBracketIcon, ChatBubbleLeftRightIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { CheckCircle2 } from "lucide-react";
import { BUCKET_URL } from "@/lib/constants";
import BootcampGallery from "@/components/BootcampGallery"; // Import the new component
import AIToolsShowcase from "@/components/AIToolsShowcase"; // Import the AI tools showcase component


export default function Home() {
  const [, navigate] = useLocation();

  const modules = [
    {
      icon: <LightBulbIcon className="w-8 h-8 text-primary" strokeWidth={1.5} />,
      title: "What is AI?",
      description: "Learn the fundamentals of artificial intelligence and its core concepts.",
    },
    {
      icon: <ChatBubbleLeftRightIcon className="w-8 h-8 text-primary" strokeWidth={1.5} />,
      title: "Tool Building",
      description: "Create your own AI-powered tools and applications.",
    },
    {
      icon: <CodeBracketIcon className="w-8 h-8 text-primary" strokeWidth={1.5} />,
      title: "Basics of Talent Intelligence",
      description: "Understand how AI is transforming recruitment and talent management.",
    },
    {
      icon: <ArrowsRightLeftIcon className="w-8 h-8 text-primary" strokeWidth={1.5} />,
      title: "AI's Impact on Jobs",
      description: "Explore how AI is reshaping the economy and job market.",
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
        {/* Curriculum Section with Prompting */}
        <section id="curriculum" className="py-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            What You'll Learn
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {modules.map((module) => (
              <div key={module.title} className="p-6 rounded-lg bg-card hover:shadow-lg transition-shadow">
                <div className="mb-4">{module.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{module.title}</h3>
                <p className="text-muted-foreground">{module.description}</p>
              </div>
            ))}
          </div>

          
        </section>

        {/* Hands-on Training Section */}
        <section className="py-20 bg-slate-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Hands-on AI Training
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="overflow-hidden rounded-lg bg-card">
                  <img 
                    src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop"
                    alt="AI Robots Lab Training" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3">Advanced AI Labs</h3>
                    <p className="text-muted-foreground">
                      Get hands-on experience with cutting-edge AI robots and equipment in our state-of-the-art laboratory facilities.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="overflow-hidden rounded-lg bg-card">
                  <img 
                    src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&auto=format&fit=crop"
                    alt="AI Robot Training Course" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3">Practical Exercises</h3>
                    <p className="text-muted-foreground">
                      Learn through interactive exercises and real-world scenarios, developing practical skills in AI and robotics.
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
                  src={`${BUCKET_URL}/images/homepage/economic_impact.png`}
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
                    src={`${BUCKET_URL}/images/homepage/instructor.png`}
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
        <AIToolsShowcase /> {/* Added AIToolsShowcase component */}
        <BootcampGallery /> {/* Added BootcampGallery component */}

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