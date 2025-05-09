import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-20 md:py-28">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-green-400 to-teal-300 rounded-full opacity-20 blur-3xl"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="text-sm font-medium text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Transforming Professionals with AI Skills
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">LexDuo</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300"> Academy</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-xl mx-auto lg:mx-0">
              Master practical AI skills through our specialized workshops designed for today's professionals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link href="/events" className="px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                Browse Workshops
              </Link>
              <Link href="/about" className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all duration-200">
                About Us
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-yellow-300">10+</div>
                <div className="text-sm text-blue-100">Workshops</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-yellow-300">2hr</div>
                <div className="text-sm text-blue-100">Sessions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-yellow-300">500+</div>
                <div className="text-sm text-blue-100">Graduates</div>
              </div>
            </div>
          </div>
          
          {/* Right content - Featured workshop card */}
          <div className="lg:w-1/2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-1">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-5 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-yellow-400 text-indigo-900 text-xs font-bold px-3 py-1 rounded-full">FEATURED</div>
                    <div className="text-white/80 text-sm">May 30, 2025</div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">AI Basics Bootcamp</h3>
                  <p className="text-blue-100 mb-4">Learn to build production-ready AI tools in just two hours. In this hands-on workshop, you'll create an AI Recruiter and Analyst while mastering essential AI concepts.</p>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4 border border-white/10">
                    <h4 className="font-semibold text-white mb-2">What You'll Learn:</h4>
                    <ul className="text-blue-100 text-sm space-y-1">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-300 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Build an AI Recruiter that matches candidates to job descriptions
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-300 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Create an AI Analyst that processes data and provides insights
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-300 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Develop custom AI avatars for automated assistance
                      </li>
                    </ul>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-white/80">Instructor</div>
                      <div className="text-white font-medium">Mike Wolford</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-yellow-300">$199</div>
                    <Link href="/events/1" className="px-4 py-2 rounded-lg bg-white text-indigo-600 font-bold hover:bg-blue-50 transition-colors">
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
