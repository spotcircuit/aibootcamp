import { CheckCircle2 } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function WhatIsAI() {
  return (
    <div className="min-h-screen">
      <Navigation />
      {/* What is AI Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12">
            What is AI?
          </h1>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-lg border bg-card">
                <img 
                  src="/attached_assets/image_1742408574966.png" 
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
                  src="/attached_assets/image_1742408591793.png" 
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

      {/* Discussion Section */}
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
                src="/attached_assets/image_1742408666665.png" 
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
                src="/attached_assets/image_1742408738311.png" 
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
                src="/attached_assets/image_1742408756740.png" 
                alt="AI History and Evolution" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}