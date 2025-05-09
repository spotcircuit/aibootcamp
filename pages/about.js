import Navigation from '../components/Navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function About() {
  // State to track which team member images exist
  const [imageExists, setImageExists] = useState({
    mikeWolford: false,
    brianPyatt: false,
    richardRosner: false,
    deanDaCosta: false
  });

  // Check if images exist on component mount
  useEffect(() => {
    const checkImageExists = async (imagePath, memberKey) => {
      try {
        const response = await fetch(imagePath);
        if (response.ok) {
          setImageExists(prev => ({ ...prev, [memberKey]: true }));
        }
      } catch {
        // Image doesn't exist or there was an error, keep using SVG
      }
    };

    // Check for each team member image
    checkImageExists('/mike-wolford.jpg', 'mikeWolford');
    checkImageExists('/brian-pyatt.jpg', 'brianPyatt');
    checkImageExists('/richard-rosner.jpg', 'richardRosner');
    checkImageExists('/dean-dacosta.jpg', 'deanDaCosta');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900">
      <Navigation />
      
      <div className="relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-indigo-400 to-purple-300 rounded-full opacity-10"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full opacity-10"></div>
          <div className="absolute inset-0 bg-grid-indigo/[0.03] bg-[length:20px_20px]"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-3 py-1 mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                <span className="text-sm font-medium text-indigo-800 dark:text-indigo-300 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.35-.035-.691-.1-1.021A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                  Our Story
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900 dark:text-white">
                About <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">LexDuo Academy</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Transforming professionals with practical AI skills through expert-led workshops and hands-on learning.
              </p>
            </div>
            
            {/* Company Overview */}
            <section className="mb-16 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Company Overview
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg leading-relaxed">
                  LexDuo Academy is a leading provider of AI education and training, specializing in practical, hands-on bootcamps 
                  that transform beginners into skilled AI practitioners. Our comprehensive curriculum combines theoretical 
                  knowledge with real-world applications, ensuring that our graduates are well-prepared for the demands of 
                  the rapidly evolving AI industry.
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  Founded by a team of AI experts and educators, LexDuo Academy bridges the gap between academic learning and 
                  industry requirements, providing students with the skills and confidence they need to succeed in their 
                  AI careers.
                </p>
              </div>
            </section>
            
            {/* Mission & Vision */}
            <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden text-white transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="p-8 h-full flex flex-col">
                  <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <p className="text-white/90 text-lg leading-relaxed flex-grow">
                    To democratize AI education and make cutting-edge technology accessible to everyone, regardless of their 
                    background or prior experience.
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl shadow-xl overflow-hidden text-white transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="p-8 h-full flex flex-col">
                  <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                  <p className="text-white/90 text-lg leading-relaxed flex-grow">
                    Creating a world where AI literacy is as fundamental as digital literacy, empowering individuals and 
                    organizations to harness the power of artificial intelligence for positive impact.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Values */}
            <section className="mb-16">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">Our Core Values</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  The principles that guide everything we do at LexDuo Academy.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                  <div className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                  <div className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-4 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Innovation</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We stay at the forefront of AI advancements, continuously updating our curriculum to reflect the 
                      latest technologies and methodologies.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                  <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
                  <div className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Accessibility</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We make complex concepts understandable, breaking down advanced AI topics into digestible, 
                      approachable lessons for learners of all levels.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                  <div className="h-2 bg-gradient-to-r from-purple-600 to-pink-500"></div>
                  <div className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Practical Application</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We focus on real-world applications, teaching students to build functioning AI tools and systems they can use in their professional lives.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                  <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                  <div className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mb-4 group-hover:bg-amber-200 dark:group-hover:bg-amber-800/50 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Community</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We foster a supportive learning environment where students collaborate, share insights, and build lasting professional connections.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Team */}
            <section className="mb-16">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">Meet Our Team</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  The experts behind LexDuo Academy&apos;s innovative AI curriculum.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Team Member 1 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                  <div className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                  <div className="p-6 text-center">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 p-1 mx-auto mb-6">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center">
                        {imageExists.mikeWolford ? (
                          <Image 
                            src="/mike-wolford.jpg" 
                            alt="Mike Wolford" 
                            width={112} 
                            height={112} 
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <svg className="w-16 h-16 text-indigo-300 dark:text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                          </svg>
                        )}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Mike Wolford</h3>
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-3">CEO, Founder</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Visionary entrepreneur with extensive experience in AI and educational technology. Passionate about democratizing access to cutting-edge AI skills through practical, hands-on learning.
                    </p>
                  </div>
                </div>
                
                {/* Team Member 2 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                  <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
                  <div className="p-6 text-center">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 p-1 mx-auto mb-6">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center">
                        {imageExists.brianPyatt ? (
                          <Image 
                            src="/brian-pyatt.jpg" 
                            alt="Brian Pyatt" 
                            width={112} 
                            height={112} 
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <svg className="w-16 h-16 text-blue-300 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                          </svg>
                        )}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Brian Pyatt</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">CTO & Founder of SpotCircuit</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Expert in AI workflow technologies and system architecture. Founder of SpotCircuit (www.spotcircuit.com), an AI Automation Agency specializing in building scalable AI solutions for enterprise applications. Visit <a href="https://portfolio.spotcircuit.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">portfolio.spotcircuit.com</a> for more info.
                    </p>
                  </div>
                </div>
                
                {/* Team Member 3 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                  <div className="h-2 bg-gradient-to-r from-purple-600 to-pink-500"></div>
                  <div className="p-6 text-center">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 p-1 mx-auto mb-6">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center">
                        {imageExists.richardRosner ? (
                          <Image 
                            src="/richard-rosner.jpg" 
                            alt="Richard D Rosner" 
                            width={112} 
                            height={112} 
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <svg className="w-16 h-16 text-purple-300 dark:text-purple-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                          </svg>
                        )}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Richard D Rosner</h3>
                    <p className="text-purple-600 dark:text-purple-400 font-medium mb-3">Senior Advisor</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Distinguished thought leader with decades of experience in strategic technology implementation. Known for his innovative approaches to AI education and workforce development. Brings invaluable industry insights and connections to the LexDuo Academy team.
                    </p>
                  </div>
                </div>
                
                {/* Team Member 4 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                  <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                  <div className="p-6 text-center">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 p-1 mx-auto mb-6">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center">
                        {imageExists.deanDaCosta ? (
                          <Image 
                            src="/dean-dacosta.jpg" 
                            alt="Dean Da Costa" 
                            width={112} 
                            height={112} 
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <svg className="w-16 h-16 text-amber-300 dark:text-amber-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                          </svg>
                        )}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Dean Da Costa</h3>
                    <p className="text-amber-600 dark:text-amber-400 font-medium mb-3">Senior Instructor</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Renowned AI educator with extensive experience in practical applications of artificial intelligence. Specializes in teaching complex AI concepts through hands-on, project-based learning approaches that prepare students for real-world challenges.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Call to Action */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden text-white p-10 text-center">
              <h2 className="text-3xl font-bold mb-4">Join Our AI Bootcamp</h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Ready to start your journey in AI? Explore our upcoming bootcamps and take the first step toward a 
                rewarding career in artificial intelligence.
              </p>
              <Link href="/events" className="inline-block bg-white text-indigo-600 font-bold py-4 px-8 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-lg">
                View Upcoming Bootcamps
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}