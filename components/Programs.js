import Link from 'next/link';

export default function Programs() {
  const programs = [
    {
      id: 1,
      title: "AI Fundamentals",
      description: "Master the core concepts of artificial intelligence and machine learning in our flagship AI Basics Bootcamp. Learn to build an AI Recruiter, Analyst, and custom AI Avatars in just 2 hours.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: "from-blue-500 to-cyan-400",
      link: "/events?category=fundamentals",
      features: ["AI Recruiter Development", "Data Analysis Tools", "Custom AI Avatars", "Prompt Engineering"]
    },
    {
      id: 2,
      title: "AI for Business",
      description: "Learn how to implement AI solutions that drive business growth and operational efficiency.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-green-500 to-emerald-400",
      link: "/events?category=business"
    },
    {
      id: 3,
      title: "AI Development",
      description: "Build production-ready AI applications with modern frameworks and best practices.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      color: "from-purple-500 to-indigo-400",
      link: "/events?category=development"
    },
    {
      id: 4,
      title: "AI Ethics & Governance",
      description: "Navigate the ethical considerations and regulatory landscape of AI implementation.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: "from-red-500 to-pink-400",
      link: "/events?category=ethics"
    },
    {
      id: 5,
      title: "AI for Creatives",
      description: "Explore how AI can enhance creative processes in design, content creation, and artistic expression.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: "from-yellow-500 to-amber-400",
      link: "/events?category=creative"
    },
    {
      id: 6,
      title: "AI for Healthcare",
      description: "Discover applications of AI in healthcare, from diagnostics to patient care and medical research.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: "from-rose-500 to-red-400",
      link: "/events?category=healthcare"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-indigo-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 -right-20 w-64 h-64 bg-gradient-to-br from-purple-400 to-indigo-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full opacity-20 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 mb-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <span className="text-sm font-medium text-white flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              Our Training Programs
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Specialized AI Training for <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300">Every Professional</span>
          </h2>
          
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            From fundamentals to advanced applications, our focused 2-hour workshops deliver practical AI skills for today's competitive landscape.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <Link 
              href={program.link} 
              key={program.id}
              className="program-card group"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${program.color} flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                {program.icon}
              </div>
              
              <h3 className="program-card-title">{program.title}</h3>
              <p className="program-card-description">{program.description}</p>
              {program.features && (
                <ul className="program-card-features">
                  {program.features.map((feature, index) => (
                    <li key={index} className="text-sm text-blue-200">{feature}</li>
                  ))}
                </ul>
              )}
              
              <div className="flex items-center text-yellow-300 font-medium">
                <span>Explore workshops</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link 
            href="/events" 
            className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all duration-200 inline-flex items-center"
          >
            View All Workshops
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
