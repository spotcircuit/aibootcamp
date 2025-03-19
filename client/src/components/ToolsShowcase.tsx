import { SiOpenai, SiGithubcopilot, SiHuggingface } from "react-icons/si";
import { Brain } from "lucide-react";

const tools = [
  {
    name: "OpenAI Suite",
    icon: <SiOpenai className="w-12 h-12" />,
    description: "Master GPT-4, DALL-E, and other OpenAI technologies"
  },
  {
    name: "Stability AI",
    icon: <Brain className="w-12 h-12" />,
    description: "Learn Stable Diffusion and advanced image generation"
  },
  {
    name: "GitHub Copilot",
    icon: <SiGithubcopilot className="w-12 h-12" />,
    description: "Enhance coding productivity with AI pair programming"
  },
  {
    name: "Hugging Face",
    icon: <SiHuggingface className="w-12 h-12" />,
    description: "Access thousands of AI models and datasets"
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
              className="p-6 rounded-lg bg-background border hover:shadow-lg transition-shadow text-center"
            >
              <div className="mb-4 flex justify-center text-primary">
                {tool.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
              <p className="text-muted-foreground">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}