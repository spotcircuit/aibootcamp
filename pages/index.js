import Head from 'next/head';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Programs from '../components/Programs';
import FAQ from '../components/FAQ';
import EventCalendar from '../components/EventCalendar';
import Testimonials from '../components/Testimonials';

export default function Home() {
  return (
    <>
      <Head>
        <title>LexDuo Academy - Specialized AI Training for Professionals</title>
        <meta name="description" content="Master practical AI skills through specialized 2-hour workshops designed for today's professionals. LexDuo Academy offers hands-on training across multiple AI disciplines." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900">
        <div className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-lg">
          <Navigation />
          
          <Hero />
          
          <section className="py-20 bg-white dark:bg-gray-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-5">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-indigo-400 to-purple-300 rounded-full"></div>
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full"></div>
              <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
            </div>
            
            <div className="container mx-auto px-6 relative z-10">
              <div className="text-center mb-12">
                <div className="inline-block px-3 py-1 mb-6 rounded-full bg-indigo-100">
                  <span className="text-sm font-medium text-indigo-800 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Upcoming Workshops
                  </span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                  Join Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Next Sessions</span>
                </h2>
                
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
                  Reserve your spot in our upcoming workshops and start your AI journey with hands-on training from industry experts.
                </p>
              </div>
            </div>
            
            <div className="container mx-auto px-6 relative z-10 mt-12 text-center">
              <Link href="/events" legacyBehavior>
                <a className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 inline-flex items-center">
                  View All Workshops
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </Link>
            </div>
          </section>
          
          <Programs />
          
          <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
              <div className="absolute top-1/4 -right-20 w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
            </div>
            
            <div className="container mx-auto px-6 relative z-10">
              <div className="text-center mb-16">
                <div className="inline-block px-3 py-1 mb-6 rounded-full bg-indigo-100">
                  <span className="text-sm font-medium text-indigo-800 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    About LexDuo Academy
                  </span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                  Transforming Professionals with <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300">Practical AI Skills</span>
                </h2>
                
                <p className="text-xl text-red-600 dark:text-red-400 max-w-3xl mx-auto font-semibold">
                  LexDuo Academy offers intensive, 2-hour live training sessions where you'll learn how to build and implement practical AI tools that can transform your professional workflow.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-8 rounded-2xl shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Approach</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Our workshops focus on practical applications rather than theoretical concepts, ensuring you walk away with skills you can implement immediately. Each session is designed to provide hands-on experience with cutting-edge AI tools and techniques.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Whether you're in talent acquisition, marketing, operations, healthcare, creative fields, or any other profession, our specialized AI training will equip you with the tools and knowledge to stay ahead in the rapidly evolving AI landscape.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-xl text-white shadow-lg">
                    <div className="text-4xl font-bold mb-2">2hr</div>
                    <p className="text-sm font-medium">Focused sessions designed for busy professionals</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-400 to-cyan-500 p-6 rounded-xl text-white shadow-lg">
                    <div className="text-4xl font-bold mb-2">10+</div>
                    <p className="text-sm font-medium">Specialized workshop topics to choose from</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-400 to-indigo-500 p-6 rounded-xl text-white shadow-lg">
                    <div className="text-4xl font-bold mb-2">100%</div>
                    <p className="text-sm font-medium">Hands-on practical learning experience</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-pink-400 to-rose-500 p-6 rounded-xl text-white shadow-lg">
                    <div className="text-4xl font-bold mb-2">24/7</div>
                    <p className="text-sm font-medium">Access to resources after workshop completion</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
              <div className="absolute top-1/4 -right-20 w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full opacity-20 blur-3xl"></div>
            </div>
            
            <div className="container mx-auto px-6 relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Your Learning <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300">Outcomes</span>
                </h2>
                
                <p className="text-xl text-red-600 dark:text-red-400 max-w-3xl mx-auto font-semibold">
                  After completing our workshops, you'll walk away with these valuable skills and insights:
                </p>
              </div>
              
              <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-white text-lg">Build and deploy AI-powered applications with confidence</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-white text-lg">Create efficient workflows with AI tools tailored to your industry</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-white text-lg">Understand AI capabilities and limitations for strategic implementation</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-white text-lg">Make informed decisions about AI implementation in your organization</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-white text-lg">Stay ahead of AI industry trends with cutting-edge knowledge</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-white text-lg">Network with AI professionals and build valuable industry connections</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <FAQ />
          
          <Testimonials />
          
          <footer className="bg-indigo-900 dark:bg-gray-900 text-white py-12">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="mb-8 md:mb-0 text-center md:text-left">
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300">LexDuo Academy</h3>
                  <p className="text-blue-100 dark:text-blue-200 mt-1">Specialized AI Training for Professionals</p>
                  <p className="text-blue-100 dark:text-blue-200 mt-2">Founded by Mike Wolford</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left mb-8 md:mb-0">
                  <div>
                    <h4 className="text-lg font-semibold text-white dark:text-gray-300 mb-4">Programs</h4>
                    <ul className="space-y-2">
                      <li><a href="/events?category=fundamentals" className="text-blue-100 dark:text-blue-200 hover:text-yellow-300 transition-colors">AI Fundamentals</a></li>
                      <li><a href="/events?category=business" className="text-blue-100 dark:text-blue-200 hover:text-yellow-300 transition-colors">AI for Business</a></li>
                      <li><a href="/events?category=development" className="text-blue-100 dark:text-blue-200 hover:text-yellow-300 transition-colors">AI Development</a></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white dark:text-gray-300 mb-4">Resources</h4>
                    <ul className="space-y-2">
                      <li><a href="#" className="text-blue-100 dark:text-blue-200 hover:text-yellow-300 transition-colors">Success Stories</a></li>
                      <li><a href="#" className="text-blue-100 dark:text-blue-200 hover:text-yellow-300 transition-colors">Blog</a></li>
                      <li><a href="#" className="text-blue-100 dark:text-blue-200 hover:text-yellow-300 transition-colors">Contact</a></li>
                    </ul>
                  </div>
                  
                  <div className="col-span-2 md:col-span-1">
                    <h4 className="text-lg font-semibold text-white dark:text-gray-300 mb-4">Company</h4>
                    <div className="flex justify-center md:justify-start space-x-4">
                      <a href="#" className="text-blue-100 dark:text-blue-200 hover:text-yellow-300 transition-colors">
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="#" className="text-blue-100 dark:text-blue-200 hover:text-yellow-300 transition-colors">
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                      </a>
                      <a href="#" className="text-blue-100 hover:text-yellow-300 transition-colors">
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.398.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                      </a>
                      <a href="#" className="text-blue-100 hover:text-yellow-300 transition-colors">
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="text-center md:text-right">
                  <p className="text-blue-100 dark:text-blue-200">&copy; {new Date().getFullYear()} LexDuo Academy. All rights reserved.</p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
