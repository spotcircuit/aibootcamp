import Image from 'next/image';

export default function Tools() {
  const tools = [
    {
      name: "OpenAI Suite",
      description: "Master GPT-4, DALL-E, and other OpenAI technologies",
      icon: "/openai-icon.svg",
      iconFallback: (
        <svg className="w-12 h-12 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.051 6.051 0 0 0 8.7569-1.6628 5.9894 5.9894 0 0 0 1.1779-2.8781 6.0557 6.0557 0 0 0-.7207-5.0441 5.9894 5.9894 0 0 0 .371-3.8168zM13.2599 22.848a4.8417 4.8417 0 0 1-2.1659-3.9594 4.8286 4.8286 0 0 1 .7927-3.5937 4.7999 4.7999 0 0 1 2.1377-1.7535 4.8417 4.8417 0 0 1 4.5058.6183 4.8392 4.8392 0 0 1 .7337 6.7979A4.8168 4.8168 0 0 1 13.2599 22.848zM3.6869 15.452a4.8365 4.8365 0 0 1-.591-3.4473 4.829 4.829 0 0 1 1.3892-2.748 4.8365 4.8365 0 0 1 3.3296-1.5554 4.8386 4.8386 0 0 1 3.0975 1.1453 4.7828 4.7828 0 0 1 1.8582 2.678 4.8771 4.8771 0 0 1-1.4008 4.6953 4.8673 4.8673 0 0 1-1.9371 1.1917 4.7746 4.7746 0 0 1-4.7114-1.1183 4.8365 4.8365 0 0 1-1.0342-1.7913zM16.7519 3.99a4.7555 4.7555 0 0 1 3.4841 2.2748 4.8373 4.8373 0 0 1-1.6095 6.6847 4.7519 4.7519 0 0 1-6.1086.7854 4.84 4.84 0 0 1-2.3733-6.011 4.7624 4.7624 0 0 1 2.3645-2.721 4.7637 4.7637 0 0 1 4.2428-.0129zM19.267 15.0979a4.8375 4.8375 0 0 1 .9671 4.0842 4.7534 4.7534 0 0 1-2.4338 3.2926 4.8368 4.8368 0 0 1-7.3586-2.4922 4.7945 4.7945 0 0 1 .5305-4.4324 4.8392 4.8392 0 0 1 2.718-2.314 4.7971 4.7971 0 0 1 4.4964.4883 4.7624 4.7624 0 0 1 1.0804 1.3735zM15.2148 9.829a2.2497 2.2497 0 0 0-1.234 1.2332 2.2488 2.2488 0 0 0 3.0354 2.891 2.2496 2.2496 0 0 0 1.2332-1.2333 2.2483 2.2483 0 0 0-3.0346-2.891z" fill="currentColor"/>
        </svg>
      )
    },
    {
      name: "Google Gemini",
      description: "Leverage Google's multimodal AI for complex tasks",
      icon: "/gemini-icon.svg",
      iconFallback: (
        <svg className="w-12 h-12 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 18V12L7 7M12 12L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      name: "Anthropic Claude",
      description: "Harness Claude's reasoning and document analysis capabilities",
      icon: "/claude-icon.svg",
      iconFallback: (
        <svg className="w-12 h-12 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 12C2 6.47715 6.47715 2 12 2V2C17.5228 2 22 6.47715 22 12V12C22 17.5228 17.5228 22 12 22V22C6.47715 22 2 17.5228 2 12V12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 14C9.10457 14 10 13.1046 10 12C10 10.8954 9.10457 10 8 10C6.89543 10 6 10.8954 6 12C6 13.1046 6.89543 14 8 14Z" fill="currentColor"/>
          <path d="M16 14C17.1046 14 18 13.1046 18 12C18 10.8954 17.1046 10 16 10C14.8954 10 14 10.8954 14 12C14 13.1046 14.8954 14 16 14Z" fill="currentColor"/>
          <path d="M9 17H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      name: "Perplexity AI",
      description: "Master search and information synthesis with Perplexity",
      icon: "/perplexity-icon.svg",
      iconFallback: (
        <svg className="w-12 h-12 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.5 3.5H14.5L20.5 9.5V14.5L14.5 20.5H9.5L3.5 14.5V9.5L9.5 3.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 19.01L12.01 18.9989" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      name: "GitHub Copilot",
      description: "Enhance coding productivity with AI pair programming",
      icon: "/github-icon.svg",
      iconFallback: (
        <svg className="w-12 h-12 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 19C4.7 20.4 4.7 16.5 3 16M15 21V17.5C15 16.5 15.1 16.1 14.5 15.5C17.3 15.2 20 14.1 20 9.49995C19.9988 8.30492 19.5325 7.15726 18.7 6.29995C19.0905 5.26192 19.0545 4.11158 18.6 3.09995C18.6 3.09995 17.5 2.79995 15.1 4.39995C13.0672 3.87054 10.9328 3.87054 8.9 4.39995C6.5 2.79995 5.4 3.09995 5.4 3.09995C4.94548 4.11158 4.90953 5.26192 5.3 6.29995C4.46745 7.15726 4.00122 8.30492 4 9.49995C4 14.1 6.7 15.2 9.5 15.5C8.9 16.1 8.9 16.7 9 17.5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      name: "Stability AI",
      description: "Learn Stable Diffusion and advanced image generation",
      icon: "/stability-icon.svg",
      iconFallback: (
        <svg className="w-12 h-12 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7.5 12H16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 16.5V7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  return (
    <section id="tools" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-3">Master Industry-Leading AI Tools</h2>
        <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Our bootcamp provides hands-on experience with the most powerful AI tools available today,
          giving you practical skills you can apply immediately.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tools.map((tool, index) => (
            <div key={index} className="bg-gray-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="mb-4 flex justify-center">
                {tool.iconFallback}
              </div>
              <h3 className="text-xl font-bold text-center mb-2 text-blue-800">{tool.name}</h3>
              <p className="text-gray-600 text-center">{tool.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
            During our intensive bootcamp, you'll learn not just the theory but the practical implementation 
            of these powerful AI tools to solve real business problems.
          </p>
          <a 
            href="#schedule"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            See Available Sessions
          </a>
        </div>
      </div>
    </section>
  );
}
