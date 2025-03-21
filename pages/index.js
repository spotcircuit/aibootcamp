import Head from 'next/head';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import FAQ from '../components/FAQ';
import EventCalendar from '../components/EventCalendar';
import Instructor from '../components/Instructor';
import Tools from '../components/Tools';
import Testimonials from '../components/Testimonials';

export default function Home() {
  return (
    <div>
      <Head>
        <title>AI Bootcamp - Learn to Build AI Tools in 2 Hours</title>
        <meta name="description" content="Join our intensive AI bootcamp and learn how to build practical AI tools in just 2 hours. Perfect for beginners and professionals alike." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />
      
      <Hero />
      
      <section id="what" className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">What is AI Bootcamp?</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl mb-6">
              AI Bootcamp is an intensive, 2-hour live training session where you'll learn how to build practical AI tools that can transform your professional workflow. Led by industry experts, this bootcamp is designed for both beginners and seasoned professionals alike.
            </p>
            <p className="text-xl mb-6">
              In just one session, you'll gain hands-on experience building AI agents that can automate complex tasks, analyze data, and help you make more informed decisions. Our bootcamp focuses on practical applications rather than theoretical concepts, ensuring you walk away with skills you can implement immediately.
            </p>
            <p className="text-xl">
              Whether you're in talent acquisition, marketing, operations, or any other field, our AI Bootcamp will equip you with the tools and knowledge to stay ahead in the rapidly evolving AI landscape.
            </p>
          </div>
        </div>
      </section>
      
      <section id="curriculum" className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Curriculum Overview</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <div className="text-blue-600 text-4xl mb-4">01</div>
              <h3 className="text-xl font-bold mb-2">AI Recruiter</h3>
              <p className="text-gray-600">Learn how to build an AI-powered recruiting tool that can parse resumes, match candidates to job descriptions, and generate interview questions.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <div className="text-blue-600 text-4xl mb-4">02</div>
              <h3 className="text-xl font-bold mb-2">AI Analyst</h3>
              <p className="text-gray-600">Create intelligent data analysis tools that can process large datasets and provide actionable business insights within minutes.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <div className="text-blue-600 text-4xl mb-4">03</div>
              <h3 className="text-xl font-bold mb-2">AI Avatars</h3>
              <p className="text-gray-600">Discover how to build and customize AI avatars for customer service, content creation, and automated assistance.</p>
            </div>
          </div>
        </div>
      </section>
      
      <EventCalendar />
      
      <Instructor />
      
      <section id="outcomes" className="py-12 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Your Learning Outcomes</h2>
          
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-y-6 gap-x-12">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-blue-600 mr-3 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-700 text-lg">Build and deploy AI-powered applications</p>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-blue-600 mr-3 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-700 text-lg">Create efficient workflows with AI tools</p>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-blue-600 mr-3 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-700 text-lg">Understand AI capabilities and limitations</p>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-blue-600 mr-3 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-700 text-lg">Make informed decisions about AI implementation</p>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-blue-600 mr-3 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-700 text-lg">Stay ahead of AI industry trends</p>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-blue-600 mr-3 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-700 text-lg">Network with AI professionals</p>
            </div>
          </div>
        </div>
      </section>
      
      <FAQ />
      
      <Tools />
      
      <Testimonials />
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">AI Bootcamp</h3>
              <p className="text-gray-400">Learn to build AI tools in 2 hours</p>
              <p className="text-gray-400 mt-2">Founded by Mike Wolford</p>
            </div>
            <div>
              <p>&copy; {new Date().getFullYear()} AI Bootcamp. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
