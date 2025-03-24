import { BeakerIcon, ChartBarSquare, UserCircle } from "@heroicons/react/24/outline";

export default function AIToolsShowcase() {
  const tools = [
    {
      name: "The AI Recruiter",
      icon: <UserCircle className="w-12 h-12" />,
      description: "Master AI-powered recruitment and candidate evaluation",
      link: "https://chatgpt.com/g/g-btWOtmuw3-the-ai-recruiter",
      gradient: "from-blue-500/10 to-purple-500/10"
    },
    {
      name: "Talent Intelligence Agent",
      icon: <BeakerIcon className="w-12 h-12" />,
      description: "Analyze talent trends and workforce insights",
      link: "https://chatgpt.com/g/g-673d259b4bfc8191b6e84577871fab96-talent-intelligence-agent",
      gradient: "from-emerald-500/10 to-cyan-500/10"
    },
    {
      name: "AI Avatar Creation",
      icon: <ChartBarSquare className="w-12 h-12" />,
      description: "Build and customize your own AI avatar",
      gradient: "from-orange-500/10 to-rose-500/10"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-950 to-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-white">
          Build Real AI Tools
        </h2>
        <p className="text-center text-slate-300 mb-12 max-w-2xl mx-auto">
          During the bootcamp, you'll create practical AI tools including an AI Recruiter,
          Talent Intelligence Agent, and your own AI Avatar.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className={`p-6 rounded-xl bg-gradient-to-br ${tool.gradient} backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all`}
            >
              <div className="mb-4 text-primary">{tool.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{tool.name}</h3>
              <p className="text-slate-300">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
