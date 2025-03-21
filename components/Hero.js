import Link from 'next/link';

export default function Hero() {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="block text-white text-5xl font-bold tracking-tight sm:text-7xl">AI Boot Camp</span>
          <span className="block text-white text-2xl font-normal mt-1">Learn to build AI tools in 2 hours</span>
        </h1>
        
        <p className="bg-white text-blue-900 rounded-lg p-4 text-xl font-medium shadow-lg">
          Our hands-on bootcamp will teach you how to build production-ready AI tools
          in just two hours. Perfect for beginners and professionals alike.
        </p>
        
        <p className="mt-6 bg-white text-blue-900 rounded-lg p-4 text-xl font-medium shadow-lg">
          Join our comprehensive bootcamp where we will build an AI Recruiter and Analyst 
          and learn how to create our own AI Avatars.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4">
          <div className="bg-white/90 text-blue-900 px-3 py-2 rounded-lg shadow-md">
            <span className="font-bold text-2xl block">$199</span>
            <span className="text-sm">Investment</span>
          </div>
          <div className="bg-white/90 text-blue-900 px-3 py-2 rounded-lg shadow-md">
            <span className="font-bold text-2xl block">2 Hours</span>
            <span className="text-sm">Duration</span>
          </div>
          <div className="bg-white/90 text-blue-900 px-3 py-2 rounded-lg shadow-md">
            <span className="font-bold text-2xl block">Virtual</span>
            <span className="text-sm">Location</span>
          </div>
          <Link href="/register" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
