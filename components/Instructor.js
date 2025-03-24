import Image from 'next/image';

export default function Instructor() {
  // Use the environment variable for the instructor image
  const instructorImageUrl = process.env.NEXT_PUBLIC_INSTRUCTOR_IMAGE_URL || '/images/mike-wolford.jpg';
  
  return (
    <section id="instructor" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Your Instructor</h2>
        
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 flex items-center justify-center p-6 md:p-8">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-blue-100">
                <Image
                  src={instructorImageUrl}
                  alt="Mike Wolford"
                  width={192}
                  height={192}
                  className="object-cover"
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    e.target.style.display = 'none';
                    e.target.parentNode.classList.add('bg-blue-100', 'flex', 'items-center', 'justify-center');
                    const svg = document.createElement('svg');
                    svg.className = 'w-24 h-24 text-blue-500';
                    svg.setAttribute('viewBox', '0 0 24 24');
                    svg.setAttribute('fill', 'none');
                    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                    svg.innerHTML = `
                      <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    `;
                    e.target.parentNode.appendChild(svg);
                  }}
                />
              </div>
            </div>
            
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold text-blue-800 mb-2">MIKE WOLFORD</h3>
              
              <ul className="space-y-4 mb-6">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                    <svg className="h-3 w-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">CEO, Lex Duo</span>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                    <svg className="h-3 w-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Author</span>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                    <svg className="h-3 w-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Educator</span>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                    <svg className="h-3 w-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Builder of AI Tools for TA</span>
                </li>
              </ul>
              
              <div className="mt-8">
                <p className="text-gray-600 mb-4">
                  Mike Wolford brings over a decade of experience in artificial intelligence research and education. 
                  His unique approach blends theoretical foundations with practical applications, 
                  making complex AI concepts accessible to students at all levels.
                </p>
                <p className="text-gray-600">
                  During this bootcamp, Mike will guide you through building production-ready AI tools
                  while sharing valuable insights from his extensive experience in the field.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700 mb-6">
            <em>&quot;I don&apos;t believe in waiting for the future—I build it.&quot;</em>
          </p>
          <p className="text-blue-600 font-medium">- Mike Wolford</p>
        </div>
      </div>
    </section>
  );
}
