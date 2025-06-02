import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';

export default function Testimonials() {
  const [testimonialImages, setTestimonialImages] = useState({});
  
  // Base URL for Supabase Storage
  const storageBaseUrl = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL || '';
  
  // Define testimonials with image paths that will be used with Supabase Storage
  const testimonials = useMemo(() => [
    {
      name: "Brian Ledoux",
      title: "Lead Technical Recruiter at SoFi",
      imagePath: "testimonials/brian-ledoux.jpg",
      quote: "Last week I had the pleasure of attending Mike Wolford's AI basics bootcamp and learned all about AI's impact on tech, recruiting and talent acquisition as whole. We went in depth on how us industry folks can leverage this game changing technology to elevate the value we provide to our clients, candidate and other stakeholders. I am now deep down the rabbit hole of building my own AI agents thanks to Mike's guidance and expert knowledge.",
    },
    {
      name: "Hiteshita Rikhi",
      title: "Technical Recruiter | AI/ML, Engineering & Tech | LinkedIn Top Recruiting Voice",
      imagePath: "testimonials/hiteshita-rikhi.jpg",
      quote: "Just finished an insightful and enriching AI bootcamp led by Mike Wolford on building Level 1 & 2 AI agents for recruiting. The deep dive into custom-built recruiter and talent intelligence analyst agents were some of the use cases of the future of hiring automation. The biggest takeaway? Agentic AI is on the rise, and recruiting will never be the same.",
      tags: ["#AIRecruiting", "#AgenticAI", "#TalentTech", "#FutureOfHiring", "#RecruitingGPT", "#TalentIntelligence"]
    },
    {
      name: "Chris Cabe",
      title: "Certified Professional Services Recruiter | Talent Acquisition Leader",
      imagePath: "testimonials/chris-cabe.jpg",
      quote: "I recently completed the first bootcamp with Mike Wolford and it's very much worth the cost! Not only did I walk away with new tips and ideas on effectively using AI to be more efficient but also got to network with some top tier TA/Recruiting professionals!",
      tags: ["#Recruiting", "#TalentAcquisition", "#Sourcer", "#AI", "#AIBootcamp", "#RecOps", "#RecruitingOps"]
    },
    {
      name: "Carrie Collier",
      title: "Talent Acquisition and Sourcing Leader | Military Spouse",
      imagePath: "testimonials/carrie-collier.jpg",
      quote: "I'm incredibly grateful I took this step to learn because now I can build a custom AI agent... one that boosts my productivity while still staying true to my voice, tone, and style. WOW! So, am I sitting here on a Saturday refining my first agent? Absolutely... and I can't wait to explore more ways AI can help optimize my time and organize my thoughts.",
    },
    {
      name: "Jen Jones",
      title: "Cedar is hiring! | Join our Mission to Make Healthcare More Affordable & Accessible",
      imagePath: "testimonials/jen-jones.jpg",
      quote: "Recently built two custom agents thanks to Mike Wolford's bootcamp. I got a beautiful list of recruiter interview questions broken out into categories. AI can also create you a rubric so you can show how you are assessing and measuring. It's a game changer.",
    },
    {
      name: "Michael Goldberg",
      title: "TA Operations Executive | The TA Solutionist | National Conference Keynote",
      imagePath: "testimonials/michael-goldberg.jpg",
      quote: "Do not pass go, pay the $, and sign up. I have already built three agents for nurses that are helping tremendously. Great class Mike Wolford",
    },
    {
      name: 'Chris "Aquaman" Carver',
      title: "Sr. Talent Sourcer | Webinar Host | International Conference Speaker",
      imagePath: "testimonials/chris-carver.jpg",
      quote: "Just finished the AI Bootcamp with Mike Wolford. Truly cannot recommend enough. If you are a TA professional, you need to sign up for his next one. He talks about and breaks down the principals so easily and sets you up for creating your own AI assistants. 10/10.",
    },
    {
      name: "Andrew Campbell",
      title: "Creative | Adaptable | Personable | Loyal",
      imagePath: "testimonials/andrew-campbell.jpg",
      quote: "This AI bootcamp was certainly worth it! Mike Wolford is set to disrupt and help TA staff members arm themselves with simplistic yet cutting edge builds to distance themselves from their peers. Don't run from recruitment, re-establish your relevance, and embrace the AI tidal wave.",
      tags: ["#recruiting", "#hiring", "#jobs", "#AI", "#training"]
    }
  ], []);
  
  useEffect(() => {
    // Load all testimonial images from Supabase Storage
    const loadImages = () => {
      const images = {};
      testimonials.forEach(testimonial => {
        if (testimonial.imagePath) {
          try {
            // Construct the full URL using the storage base URL
            const imageUrl = `${storageBaseUrl}/images/${testimonial.imagePath}`;
            images[testimonial.name] = imageUrl;
          } catch (error) {
            console.error(`Error setting image URL for ${testimonial.name}:`, error);
          }
        }
      });
      setTestimonialImages(images);
    };
    
    if (storageBaseUrl) {
      loadImages();
    }
  }, [storageBaseUrl, testimonials]);

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-indigo-400 to-purple-300 rounded-full opacity-10"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full opacity-10"></div>
        <div className="absolute inset-0 bg-grid-indigo/[0.03] bg-[length:20px_20px]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/50">
            <span className="text-sm font-medium text-indigo-800 dark:text-indigo-300 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Real Results
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Success <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Stories</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our graduates have to say about their experience.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-gray-800"
            >
              <div className="relative">
                {/* Gradient overlay at top of card */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600 p-0.5 flex-shrink-0 mr-4 shadow-md">
                      <div className="rounded-full overflow-hidden w-full h-full bg-white dark:bg-gray-700">
                        {testimonialImages[testimonial.name] ? (
                          <Image
                            src={testimonialImages[testimonial.name]}
                            alt={testimonial.name}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <svg className="w-full h-full text-indigo-500 p-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-indigo-800 dark:text-indigo-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.title}</p>
                    </div>
                  </div>
                  
                  <div className="relative mb-6">
                    <svg className="absolute top-0 left-0 w-10 h-10 text-indigo-100 dark:text-indigo-900 transform -translate-x-4 -translate-y-4" fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed relative z-10">&quot;{testimonial.quote}&quot;</p>
                  </div>
                  
                  {testimonial.tags && (
                    <div className="flex flex-wrap gap-2">
                      {testimonial.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex} 
                          className="text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 px-3 py-1 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <a 
            href="/events"
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            Join Our Next Session
          </a>
        </div>
      </div>
    </section>
  );
}
