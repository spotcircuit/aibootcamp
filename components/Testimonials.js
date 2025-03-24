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
    <section id="testimonials" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-3">Success Stories</h2>
        <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Don&apos;t just take our word for it. Here&apos;s what our graduates have to say about their experience.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex-shrink-0 mr-4">
                  {testimonialImages[testimonial.name] ? (
                    <Image
                      src={testimonialImages[testimonial.name]}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="object-cover"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <svg className="w-full h-full text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.title}</p>
                </div>
              </div>
              
              <div className="flex-grow">
                <p className="text-gray-700 italic mb-4">&quot;{testimonial.quote}&quot;</p>
              </div>
              
              {testimonial.tags && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {testimonial.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="#schedule"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Join Our Next Session
          </a>
        </div>
      </div>
    </section>
  );
}
