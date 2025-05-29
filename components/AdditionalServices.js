import Link from 'next/link';

export default function AdditionalServices() {
  // Homepage version - simplified summary of services
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-green-400 to-teal-300 rounded-full opacity-20 blur-3xl"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header section */}
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 mb-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <span className="text-sm font-medium text-white flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Premium Solutions
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Take Your AI Further - <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300">Custom Solutions Beyond the Bootcamp</span>
          </h2>
          
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            You learned to build tools. Now let us build your complete AI recruiting system.
          </p>
        </div>
        
        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Individual recruiters card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 shadow-xl transform transition-all duration-300 hover:-translate-y-2">
            <div className="h-2 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-2">Individual Recruiters</h3>
              <p className="text-blue-100 mb-4">Become an AI-Powered Recruiting Machine</p>
              
              <div className="flex space-x-2 items-baseline mb-4">
                <div className="text-lg font-bold text-yellow-300">Setup: $497</div>
                <div className="text-base font-bold text-white">+</div>
                <div className="text-lg font-bold text-yellow-300">$297/mo</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/10">
                <h4 className="font-semibold text-white mb-3">Key Benefits:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-100">Custom AI agent suite</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-100">15+ hours saved per week</span>
                  </li>
                </ul>
              </div>
              
              <Link 
                href="/services#individual" 
                className="block w-full mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                View Packages
              </Link>
            </div>
          </div>
          
          {/* Teams card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 shadow-xl transform transition-all duration-300 hover:-translate-y-2">
            <div className="h-2 bg-gradient-to-r from-blue-400 to-cyan-500"></div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-2">Teams & Companies</h3>
              <p className="text-blue-100 mb-4">Transform Your Entire Recruiting Operation</p>
              
              <div className="flex space-x-2 items-baseline mb-4">
                <div className="text-lg font-bold text-yellow-300">Setup: $2,997</div>
                <div className="text-base font-bold text-white">+</div>
                <div className="text-lg font-bold text-yellow-300">Custom Retainer</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/10">
                <h4 className="font-semibold text-white mb-3">Key Benefits:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-100">50-70% faster time-to-fill</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-100">40-60% more productive recruiters</span>
                  </li>
                </ul>
              </div>
              
              <Link 
                href="/services#teams" 
                className="block w-full mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-400 to-cyan-500 text-white font-bold text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                View Solutions
              </Link>
            </div>
          </div>
          
          {/* Support card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 shadow-xl transform transition-all duration-300 hover:-translate-y-2">
            <div className="h-2 bg-gradient-to-r from-indigo-400 to-violet-500"></div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-2">Ongoing Support</h3>
              <p className="text-blue-100 mb-4">Stay Ahead of the AI Curve</p>
              
              <div className="text-lg font-bold text-yellow-300 mb-4">$497/month</div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/10">
                <h4 className="font-semibold text-white mb-3">Key Benefits:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-100">Monthly tool updates & maintenance</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-100">Priority support & future enhancements</span>
                  </li>
                </ul>
              </div>
              
              <Link 
                href="/services#support" 
                className="block w-full mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-400 to-violet-500 text-white font-bold text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center mt-16">
          <Link 
            href="/services" 
            className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all duration-200 inline-flex items-center"
          >
            Explore All Custom Solutions
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}