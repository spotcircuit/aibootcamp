import Navigation from '../components/Navigation';

export default function Resources() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">AI Resources</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 text-center">
            Explore our collection of resources to enhance your AI learning journey
          </p>
          
          {/* Learning Materials */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Learning Materials</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tutorial */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="h-40 bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <svg className="w-20 h-20 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Beginner&apos;s Guide to AI</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    A comprehensive introduction to artificial intelligence concepts, perfect for those just starting their AI journey.
                  </p>
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Read the guide →</a>
                </div>
              </div>
              
              {/* Cheat Sheet */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="h-40 bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <svg className="w-20 h-20 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Machine Learning Cheat Sheet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Quick reference guide covering essential machine learning algorithms, terms, and formulas.
                  </p>
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Download PDF →</a>
                </div>
              </div>
            </div>
          </section>
          
          {/* Tools & Downloads */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Tools & Downloads</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Jupyter Notebooks */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="h-40 bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <svg className="w-20 h-20 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Jupyter Notebook Templates</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Ready-to-use notebook templates for common AI tasks, including data preprocessing, model training, and evaluation.
                  </p>
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Download templates →</a>
                </div>
              </div>
              
              {/* Dataset Samples */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="h-40 bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <svg className="w-20 h-20 text-yellow-500 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Dataset Samples</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Curated datasets for practicing machine learning techniques, from image classification to natural language processing.
                  </p>
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Browse datasets →</a>
                </div>
              </div>
            </div>
          </section>
          
          {/* Community Resources */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Community Resources</h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center mb-6">
                <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full mr-4 mb-4 md:mb-0">
                  <svg className="w-8 h-8 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1">Discord Community</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Join our active Discord community to connect with fellow AI enthusiasts, ask questions, and share your projects.
                  </p>
                </div>
                <a href="#" className="ml-auto mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md">
                  Join Discord
                </a>
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full mr-4 mb-4 md:mb-0">
                  <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1">Webinar Recordings</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Access recordings of our past webinars covering various AI topics, from deep learning to ethical considerations.
                  </p>
                </div>
                <a href="#" className="ml-auto mt-4 md:mt-0 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md">
                  Watch Videos
                </a>
              </div>
            </div>
          </section>
          
          {/* Industry Insights */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Industry Insights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Blog Post 1 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="h-40 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">The Future of AI in Healthcare</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    Exploring how artificial intelligence is transforming patient care, diagnosis, and treatment.
                  </p>
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">Read article →</a>
                </div>
              </div>
              
              {/* Blog Post 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="h-40 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Ethical Considerations in AI Development</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    Addressing the ethical challenges and responsibilities in creating AI systems.
                  </p>
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">Read article →</a>
                </div>
              </div>
              
              {/* Blog Post 3 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="h-40 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">AI Career Paths in 2025</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    A guide to the most in-demand AI roles and the skills needed to succeed in them.
                  </p>
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">Read article →</a>
                </div>
              </div>
            </div>
          </section>
          
          {/* Newsletter Signup */}
          <section className="bg-blue-600 dark:bg-blue-800 rounded-lg shadow-lg p-8 text-white">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
              <p className="text-blue-100">
                Subscribe to our newsletter to receive the latest AI resources, tutorials, and industry insights.
              </p>
            </div>
            
            <form className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  type="submit"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md font-medium transition duration-300"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}