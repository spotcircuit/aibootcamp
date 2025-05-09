import { useState } from 'react';

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What prerequisites do I need?",
      answer: "None. The AI Recruiter and The AI Analyst materials are included with your registration and are worth reviewing before class. Our bootcamp is designed for participants of all technical backgrounds.",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      )
    },
    {
      question: "How are the sessions structured?",
      answer: "Each bootcamp consists of 2-hour intensive sessions. This format allows for a focused learning experience that respects your time while providing comprehensive instruction on AI tools and implementation.",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      question: "What tools will I learn to use?",
      answer: "In our basics bootcamp, you will learn how to build an AI Recruiter, AI Analyst, and AI Avatar. These practical applications will give you hands-on experience with cutting-edge AI technologies that you can immediately implement in your work.",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      question: "Will I get a certificate?",
      answer: "Yes! The final exam is to build your own AI tool that can generate a certificate for you. This practical approach ensures you've mastered the skills taught in the bootcamp while providing you with a credential you can share with employers.",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    },
    {
      question: "What kind of support is available?",
      answer: "You'll receive live instruction during the course and follow-up support is available at a nominal cost. Our team is committed to helping you succeed with implementing AI tools in your professional workflow.",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      question: "What's the cost and payment structure?",
      answer: "The cost is $199 per bootcamp session. We do not accept partial payments - full payment is required at the time of registration to secure your spot.",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      question: "How advanced will the AI concepts be?",
      answer: "You'll learn to build sophisticated tools capable of creating rubrics, skills assessments, and talent intelligence reports, as well as any other task you might need in talent acquisition. The concepts are presented in an accessible way while still enabling you to create powerful AI applications.",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      question: "Can I attend part-time?",
      answer: "Since the classes are only 2 hours long, they're designed to fit into your busy schedule without requiring a part-time option. This compact format allows professionals to participate while maintaining their regular work responsibilities.",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900" id="faq">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-5">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-indigo-400 to-purple-300 rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full"></div>
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/50">
            <span className="text-sm font-medium text-indigo-800 dark:text-indigo-300 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Got Questions?
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Frequently <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Asked Questions</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about our AI bootcamps and workshops.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="mb-6 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              itemScope
              itemType="https://schema.org/Question"
            >
              <button
                className={`flex items-center justify-between w-full p-5 transition-colors ${
                  activeIndex === index 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                    : 'bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => toggleAccordion(index)}
                aria-expanded={activeIndex === index}
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 mr-4 ${activeIndex === index ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`}>
                    {faq.icon}
                  </div>
                  <span className={`text-lg font-bold ${activeIndex === index ? 'text-white' : 'text-gray-900 dark:text-white'}`} itemProp="name">
                    {faq.question}
                  </span>
                </div>
                <svg 
                  className={`w-6 h-6 ${activeIndex === index ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'} transform transition-transform ${activeIndex === index ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                className={`transition-all duration-300 ${
                  activeIndex === index 
                    ? 'max-h-96 py-6 px-6 border-t-0 border-l-2 border-r-2 border-b-2 border-indigo-100 dark:border-indigo-900 rounded-b-xl bg-gray-50 dark:bg-gray-800' 
                    : 'max-h-0 overflow-hidden'
                }`}
                aria-hidden={activeIndex !== index}
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed" itemProp="text">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="#schedule"
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            Register for a Workshop
          </a>
        </div>
      </div>
    </section>
  );
}
