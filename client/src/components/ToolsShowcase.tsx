import { SiOpenai, SiGithubcopilot, SiHuggingface } from "react-icons/si";
import { Brain } from "lucide-react";

const tools = [
  {
    name: "OpenAI Suite",
    icon: <SiOpenai className="w-12 h-12" />,
    description: "Master GPT-4, DALL-E, and other OpenAI technologies",
    bgImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23000000;stop-opacity:0.1' /%3E%3Cstop offset='100%25' style='stop-color:%23000000;stop-opacity:0' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grad)'/%3E%3C/svg%3E")`
  },
  {
    name: "Stability AI",
    icon: <Brain className="w-12 h-12" />,
    description: "Learn Stable Diffusion and advanced image generation",
    bgImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='100%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23000000;stop-opacity:0.1' /%3E%3Cstop offset='100%25' style='stop-color:%23000000;stop-opacity:0' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grad)'/%3E%3C/svg%3E")`
  },
  {
    name: "GitHub Copilot",
    icon: <SiGithubcopilot className="w-12 h-12" />,
    description: "Enhance coding productivity with AI pair programming",
    bgImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='100%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23000000;stop-opacity:0.1' /%3E%3Cstop offset='100%25' style='stop-color:%23000000;stop-opacity:0' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grad)'/%3E%3C/svg%3E")`
  },
  {
    name: "Hugging Face",
    icon: <SiHuggingface className="w-12 h-12" />,
    description: "Access thousands of AI models and datasets",
    bgImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='100%25' y1='100%25' x2='0%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23000000;stop-opacity:0.1' /%3E%3Cstop offset='100%25' style='stop-color:%23000000;stop-opacity:0' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grad)'/%3E%3C/svg%3E")`
  }
];

export default function ToolsShowcase() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Master Industry-Leading AI Tools
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="p-6 rounded-lg bg-background border hover:shadow-lg transition-shadow text-center relative overflow-hidden"
              style={{ backgroundImage: tool.bgImage }}
            >
              <div className="mb-4 flex justify-center text-primary relative z-10">
                {tool.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 relative z-10">{tool.name}</h3>
              <p className="text-muted-foreground relative z-10">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}