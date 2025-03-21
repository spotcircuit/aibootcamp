import Link from 'next/link';
import Navigation from '../components/Navigation';

export default function WhatPage() {
  return (
    <div>
      <Navigation />
      
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-8">What is AI Bootcamp?</h1>
        
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="mb-6">
            AI Bootcamp is an intensive learning experience designed to equip you with practical AI skills in just 2 hours. 
            Our mission is to make AI technology accessible to everyone, regardless of their technical background.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">What You'll Learn</h2>
          <div className="mb-6">
            <p className="mb-4">
              Our bootcamp focuses on three key areas that will give you a comprehensive understanding of AI applications:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>AI Recruiter:</strong> Learn how to build an AI-powered recruiting tool that can parse resumes, 
                match candidates to job descriptions, and even generate interview questions.
              </li>
              <li>
                <strong>AI Analyst:</strong> Create intelligent data analysis tools that can process large amounts of 
                information and provide actionable business insights.
              </li>
              <li>
                <strong>AI Avatars:</strong> Discover how to build and customize your own AI avatars for customer service, 
                content creation, and more.
              </li>
            </ul>
          </div>
          
          <h2 className="text-2xl font-semibold mb-4">Our Approach</h2>
          <p className="mb-6">
            Our bootcamp combines theory with hands-on practice. You'll not only learn the concepts behind AI tools 
            but also get practical experience building real applications. By the end of the 2-hour session, you'll 
            have created your own AI tools that you can continue to develop and use.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Who Should Attend?</h2>
          <p className="mb-6">
            This bootcamp is designed for:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Business professionals looking to leverage AI in their work</li>
            <li>Entrepreneurs exploring AI-based solutions</li>
            <li>Students interested in AI technology</li>
            <li>Anyone curious about building their own AI tools</li>
          </ul>
          
          <div className="mt-8 text-center">
            <Link href="/register">
              <span className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 inline-block">
                Register Today
              </span>
            </Link>
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-800 text-white py-8 mt-10">
        <div className="container mx-auto px-4">
          <p className="text-center">
            &copy; {new Date().getFullYear()} AI Bootcamp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
