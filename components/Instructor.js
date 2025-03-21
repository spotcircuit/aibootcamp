import Image from 'next/image';

export default function Instructor() {
  return (
    <section id="instructor" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Your Instructor</h2>
        
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 flex items-center justify-center p-6 md:p-8">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-blue-100">
                <Image 
                  src="/allan-thompson.jpg" 
                  alt="Dr. Allan D Thompson" 
                  width={192} 
                  height={192}
                  className="object-cover"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
            
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold text-blue-800 mb-2">DR. ALLAN D THOMPSON</h3>
              
              <ul className="space-y-4 mb-6">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                    <svg className="h-3 w-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Harvard Certified Coach</span>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                    <svg className="h-3 w-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Former head of Mensa International (responsible for working with child prodigies)</span>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                    <svg className="h-3 w-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Author of more than 20 books on human and artificial intelligence</span>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                    <svg className="h-3 w-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Conducted more than 50 interviews with GPT</span>
                </li>
              </ul>
              
              <div className="mt-8">
                <p className="text-gray-600 mb-4">
                  Dr. Thompson brings over two decades of experience in artificial intelligence research and education. 
                  His unique approach blends theoretical foundations with practical applications, 
                  making complex AI concepts accessible to students at all levels.
                </p>
                <p className="text-gray-600">
                  During this bootcamp, Dr. Thompson will guide you through building production-ready AI tools
                  while sharing valuable insights from his extensive experience in the field.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700 mb-6">
            <em>"My goal is to demystify AI and empower you to build practical tools that solve real problems."</em>
          </p>
          <p className="text-blue-600 font-medium">- Dr. Allan Thompson</p>
        </div>
      </div>
    </section>
  );
}
