import Navigation from '../components/Navigation';
import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">About Lexduo</h1>
          
          {/* Company Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Company Overview</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Lexduo is a leading provider of AI education and training, specializing in practical, hands-on bootcamps 
              that transform beginners into skilled AI practitioners. Our comprehensive curriculum combines theoretical 
              knowledge with real-world applications, ensuring that our graduates are well-prepared for the demands of 
              the rapidly evolving AI industry.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Founded by a team of AI experts and educators, Lexduo bridges the gap between academic learning and 
              industry requirements, providing students with the skills and confidence they need to succeed in their 
              AI careers.
            </p>
          </section>
          
          {/* Mission & Vision */}
          <section className="mb-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-400">
                To democratize AI education and make cutting-edge technology accessible to everyone, regardless of their 
                background or prior experience.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Our Vision</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Creating a world where AI literacy is as fundamental as digital literacy, empowering individuals and 
                organizations to harness the power of artificial intelligence for positive impact.
              </p>
            </div>
          </section>
          
          {/* Values */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Our Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Innovation</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We stay at the forefront of AI advancements, continuously updating our curriculum to reflect the 
                  latest technologies and methodologies.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Accessibility</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We make complex concepts understandable, breaking down advanced AI topics into digestible, 
                  approachable lessons for learners of all levels.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Practical Application</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We focus on real-world skills, ensuring that our students can apply their knowledge to solve 
                  actual problems and create valuable AI solutions.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Community</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We foster a supportive learning environment where students collaborate, share knowledge, and 
                  build lasting professional relationships.
                </p>
              </div>
            </div>
          </section>
          
          {/* Team Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Our Team</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Team Member 1 */}
              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md text-center">
                <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1">Dr. Sarah Chen</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-2">Co-Founder & Chief AI Officer</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Ph.D. in Machine Learning with 10+ years of experience in AI research and development.
                </p>
              </div>
              
              {/* Team Member 2 */}
              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md text-center">
                <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1">Michael Rodriguez</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-2">Co-Founder & CEO</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Former tech executive with expertise in scaling educational platforms and AI startups.
                </p>
              </div>
              
              {/* Team Member 3 */}
              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md text-center">
                <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1">Dr. James Wilson</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-2">Lead Instructor</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  AI researcher and educator with a passion for making complex concepts accessible to all learners.
                </p>
              </div>
            </div>
          </section>
          
          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Join Our AI Bootcamp</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Ready to start your journey in AI? Explore our upcoming bootcamps and take the first step toward a 
              rewarding career in artificial intelligence.
            </p>
            <Link href="/events" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-300">
              View Upcoming Bootcamps
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}