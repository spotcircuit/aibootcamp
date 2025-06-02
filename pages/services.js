import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navigation from '../components/Navigation';

export default function Services() {
  const [activeTab, setActiveTab] = useState('individual');
  const [selectedPackage, setSelectedPackage] = useState('starter');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [calculatorValues, setCalculatorValues] = useState({
    hoursSourcing: 20,
    hoursScreening: 15,
    submissions: 8,
    hires: 1.5,
    commission: 8000
  });
  
  // Regular and discounted launch pricing
  const packages = {
    starter: {
      setupFee: 497,
      monthlyFee: 297,
      discountedSetupFee: 248.50,
      discountedMonthlyFee: 148.50,
      tools: 3,
      hoursSaved: 15,
      billableSavings: 3000,
      displayName: 'Starter Package'
    },
    pro: {
      setupFee: 997,
      monthlyFee: 997,
      discountedSetupFee: 498.50,
      discountedMonthlyFee: 498.50,
      tools: 6,
      hoursSaved: 20,
      billableSavings: 4000,
      displayName: 'Pro Package'
    },
    enterprise: {
      setupFee: 1997,
      monthlyFee: 1997,
      discountedSetupFee: 998.50,
      discountedMonthlyFee: 998.50,
      tools: 10,
      hoursSaved: 25,
      billableSavings: 5000,
      displayName: 'Enterprise Package'
    }
  };
  
  // Launch discount enabled
  const [showLaunchDiscount, setShowLaunchDiscount] = useState(true);
  
  // Calculate ROI based on current input values
  const calculateROI = () => {
    const aiHours = {
      sourcing: Math.round(calculatorValues.hoursSourcing * 0.35), // 65% reduction
      screening: Math.round(calculatorValues.hoursScreening * 0.33) // 67% reduction
    };
    
    const aiSubmissions = Math.round(calculatorValues.submissions * 1.5); // 50% increase
    const aiHires = Number((calculatorValues.hires * 1.87).toFixed(1)); // 87% increase
    
    const additionalHiresPerMonth = aiHires - calculatorValues.hires;
    const additionalRevenue = additionalHiresPerMonth * calculatorValues.commission;
    const monthlyRevenue = additionalRevenue;
    const threeMonthROI = monthlyRevenue * 3;
    
    // Calculate package cost (setup + 3 months of retainer) with potential discount
    let setupFee, monthlyFee;
    
    if (showLaunchDiscount) {
      setupFee = packages[selectedPackage].discountedSetupFee;
      monthlyFee = packages[selectedPackage].discountedMonthlyFee;
    } else {
      setupFee = packages[selectedPackage].setupFee;
      monthlyFee = packages[selectedPackage].monthlyFee;
    }
    
    const packageCost = setupFee + (monthlyFee * 3);
    const regularPackageCost = packages[selectedPackage].setupFee + (packages[selectedPackage].monthlyFee * 3);
    const discount = regularPackageCost - packageCost;
    
    const netROI = threeMonthROI - packageCost;
    const roiPercentage = Math.round((netROI / packageCost) * 100);
    
    const hoursSaved = (calculatorValues.hoursSourcing - aiHours.sourcing) + 
                       (calculatorValues.hoursScreening - aiHours.screening);
    
    return {
      aiHours,
      aiSubmissions,
      aiHires,
      hoursSaved,
      additionalHiresPerMonth,
      monthlyRevenue,
      threeMonthROI,
      packageCost,
      regularPackageCost,
      discount,
      setupFee,
      monthlyFee,
      netROI,
      roiPercentage
    };
  };
  
  const [roi, setRoi] = useState(calculateROI());
  
  useEffect(() => {
    setRoi(calculateROI());
  }, [calculatorValues, selectedPackage]);
  
  const handleContactFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError('');
    
    try {
      const formData = new FormData(e.target);
      const formValues = Object.fromEntries(formData.entries());
      
      // Here you would typically send the form data to your API
      // For now, we'll simulate a successful submission after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Form submitted with values:', formValues);
      setFormSuccess(true);
      // Reset form
      e.target.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormError('There was an error submitting your request. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleRangeChange = (e) => {
    const { id, value } = e.target;
    const key = id.replace('avg-', '').replace('hours-', '');
    
    const updates = { ...calculatorValues };
    if (key === 'sourcing') updates.hoursSourcing = parseInt(value);
    if (key === 'screening') updates.hoursScreening = parseInt(value);
    if (key === 'submissions') updates.submissions = parseInt(value);
    if (key === 'hires') updates.hires = parseFloat(value);
    if (key === 'commission') updates.commission = parseInt(value);
    
    setCalculatorValues(updates);
    
    // Update the label next to the slider
    if (key === 'commission') {
      document.getElementById(`${id}-value`).textContent = `$${parseInt(value).toLocaleString()}`;
    } else {
      document.getElementById(`${id}-value`).textContent = value;
    }
  };
  
  // Common component for benefit items
  const BenefitItem = ({ text }) => (
    <li className="flex items-start mb-3">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <span className="text-gray-700 dark:text-gray-200">{text}</span>
    </li>
  );
  
  // Common component for feature items
  const FeatureItem = ({ icon, title, description }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="mb-4 text-indigo-600 dark:text-indigo-400">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-700 dark:text-gray-200">{description}</p>
    </div>
  );

  return (
    <>
      <Head>
        <title>AI Services - LexDuo Academy</title>
        <meta name="description" content="Custom AI solutions for recruiting professionals and companies. Increase efficiency, reduce time-to-hire, and transform your recruiting operations." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900">
        <Navigation />
        
        {/* Hero section */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute top-1/2 -right-24 w-80 h-80 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-green-400 to-teal-300 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AI Services for <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300">Recruiting Excellence</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-3">
              Custom AI solutions that transform your recruiting operationsâ€”setup fee plus monthly retainer includes ongoing maintenance, updates, and priority support.
            </p>
            
            <p className="text-lg text-white max-w-2xl mx-auto mb-8">
              <em>Measured from job posted to offer accepted.</em>
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 border border-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white">50â€“70% Faster Time-to-Fill</span>
              </div>
              
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 border border-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white">15+ Hours Saved Weekly</span>
              </div>
              
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 border border-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white">100% Satisfaction Guarantee</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <a href="#calculator" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300">
                <span>Calculate Your ROI & Get Started</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </a>
              
              <Link href="/contact?source=services" className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-full shadow-sm text-white bg-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-300">
                <span>Schedule a Consultation</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Services navigation */}
        <section className="py-10 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button 
                onClick={() => setActiveTab('individual')}
                className={`px-6 py-3 rounded-full text-base font-bold transition-all duration-200 ${
                  activeTab === 'individual' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Individual Recruiters
              </button>
              
              <button 
                onClick={() => setActiveTab('teams')}
                className={`px-6 py-3 rounded-full text-base font-bold transition-all duration-200 ${
                  activeTab === 'teams' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Teams & Companies
              </button>
              
              <button 
                onClick={() => setActiveTab('support')}
                className={`px-6 py-3 rounded-full text-base font-bold transition-all duration-200 ${
                  activeTab === 'support' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Ongoing Support
              </button>
            </div>
            
            {/* Individual Recruiters Content */}
            {activeTab === 'individual' && (
              <div id="individual" className="animate-fadeIn">
                <div className="mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white text-center">
                    For <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Individual Recruiters</span>
                  </h2>
                  
                  <p className="text-xl text-gray-700 dark:text-gray-200 mb-8 max-w-3xl mx-auto text-center">
                    Transform your recruiting workflow with custom AI tools that dramatically increase efficiency and output.
                  </p>
                </div>
                
                {/* Pricing tiers */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {/* Starter tier */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all duration-300 hover:-translate-y-2 relative">
                    {showLaunchDiscount && (
                      <div className="absolute -top-3 -right-10 bg-red-500 text-white text-xs font-bold px-12 py-1 rotate-45">
                        50% OFF
                      </div>
                    )}
                    <div className="h-2 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Starter Package</h3>
                      
                      <div className="flex justify-center text-center mb-2">
                        <div className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                          Launch offer! First 10 clients only
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Setup Fee</p>
                          {showLaunchDiscount ? (
                            <>
                              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                                <span className="line-through text-gray-400 text-lg mr-1">$497</span>
                                $248.50
                              </p>
                              <p className="text-xs text-red-500 font-semibold">SAVE $248.50</p>
                            </>
                          ) : (
                            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">$497</p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400">one-time</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Retainer</p>
                          {showLaunchDiscount ? (
                            <>
                              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                                <span className="line-through text-gray-400 text-lg mr-1">$297</span>
                                $148.50
                              </p>
                              <p className="text-xs text-red-500 font-semibold">SAVE $148.50/mo</p>
                            </>
                          ) : (
                            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">$297</p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400">per month</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-200 mb-6">
                        Perfect for individual recruiters looking to start their AI journey.
                      </p>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">What's included:</h4>
                        <ul className="space-y-2">
                          <BenefitItem text="Custom AI Screener for pre-screening resumes" />
                          <BenefitItem text="Prompt-based Interviewer with automated scoring" />
                          <BenefitItem text="LinkedIn AI Assistant for candidate sourcing" />
                          <BenefitItem text="Weekly performance report dashboards" />
                          <BenefitItem text="Tools remain fully functional after support period" />
                        </ul>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg mb-6">
                        <p className="text-green-700 dark:text-green-400 font-semibold">Savings: 15+ hrs/week â†’ $3,000+ in billable time</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <a 
                          href="#calculator" 
                          onClick={() => setSelectedPackage('starter')}
                          className="block w-full px-4 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-sm"
                        >
                          Calculate ROI
                        </a>
                        <Link 
                          href="/contact?source=services&interest=Pro Package"
                          className="block w-full px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-sm"
                        >
                          Lock In Rate
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  {/* Pro tier */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-indigo-500 dark:border-indigo-400 overflow-hidden transform transition-all duration-300 hover:-translate-y-2 relative z-10 scale-105">
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                      MOST POPULAR
                    </div>
                    {showLaunchDiscount && (
                      <div className="absolute -top-3 -right-10 bg-red-500 text-white text-xs font-bold px-12 py-1 rotate-45">
                        50% OFF
                      </div>
                    )}
                    <div className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Pro Package</h3>
                      
                      <div className="flex justify-center text-center mb-2">
                        <div className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                          Launch offer! First 10 clients only
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Setup Fee</p>
                          {showLaunchDiscount ? (
                            <>
                              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                                <span className="line-through text-gray-400 text-lg mr-1">$997</span>
                                $498.50
                              </p>
                              <p className="text-xs text-red-500 font-semibold">SAVE $498.50</p>
                            </>
                          ) : (
                            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">$997</p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400">one-time</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Retainer</p>
                          {showLaunchDiscount ? (
                            <>
                              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                                <span className="line-through text-gray-400 text-lg mr-1">$997</span>
                                $498.50
                              </p>
                              <p className="text-xs text-red-500 font-semibold">SAVE $498.50/mo</p>
                            </>
                          ) : (
                            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">$997</p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400">per month</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-200 mb-6">
                        Complete solution for serious recruiters ready to maximize productivity.
                      </p>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">What's included:</h4>
                        <ul className="space-y-2">
                          <BenefitItem text="Multi-stage AI Assessment system" />
                          <BenefitItem text="Custom Candidate Ranking algorithm" />
                          <BenefitItem text="Advanced Sourcing (200+ candidates)" />
                          <BenefitItem text="Competitor Intelligence tools" />
                          <BenefitItem text="Integration with common ATSes" />
                          <BenefitItem text="Tools remain fully functional after support period" />
                        </ul>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg mb-6">
                        <p className="text-green-700 dark:text-green-400 font-semibold">Savings: 30+ hrs/week â†’ $6,000+ in billable time</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <a 
                          href="#calculator" 
                          onClick={() => setSelectedPackage('pro')}
                          className="block w-full px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-sm"
                        >
                          Calculate ROI
                        </a>
                        <Link 
                          href="/contact?source=services&interest=Pro Package"
                          className="block w-full px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-sm"
                        >
                          Lock In Rate
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  {/* Elite tier */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all duration-300 hover:-translate-y-2 relative">
                    {showLaunchDiscount && (
                      <div className="absolute -top-3 -right-10 bg-red-500 text-white text-xs font-bold px-12 py-1 rotate-45">
                        50% OFF
                      </div>
                    )}
                    <div className="h-2 bg-gradient-to-r from-blue-400 to-cyan-500"></div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Enterprise Package</h3>
                      
                      <div className="flex justify-center text-center mb-2">
                        <div className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                          Launch offer! First 10 clients only
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Setup Fee</p>
                          {showLaunchDiscount ? (
                            <>
                              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                                <span className="line-through text-gray-400 text-lg mr-1">$1,997</span>
                                $998.50
                              </p>
                              <p className="text-xs text-red-500 font-semibold">SAVE $998.50</p>
                            </>
                          ) : (
                            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">$1,997</p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400">one-time</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Retainer</p>
                          {showLaunchDiscount ? (
                            <>
                              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                                <span className="line-through text-gray-400 text-lg mr-1">$1,997</span>
                                $998.50
                              </p>
                              <p className="text-xs text-red-500 font-semibold">SAVE $998.50/mo</p>
                            </>
                          ) : (
                            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">$1,997</p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400">per month</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-200 mb-6">
                        Complete end-to-end solution with unlimited capabilities.
                      </p>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">What's included:</h4>
                        <ul className="space-y-2">
                          <BenefitItem text="Complete AI Recruitment Workflow" />
                          <BenefitItem text="Fine-tuned AI Models on your data" />
                          <BenefitItem text="Unlimited AI sourcing capabilities" />
                          <BenefitItem text="Market Analysis & Intelligence Reports" />
                          <BenefitItem text="Bi-weekly strategy consultation calls" />
                          <BenefitItem text="White-labeled Client Portal" />
                          <BenefitItem text="Tools remain fully functional after support period" />
                        </ul>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg mb-6">
                        <p className="text-green-700 dark:text-green-400 font-semibold">Savings: 60+ hrs/week â†’ $12,000+ in billable time</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <a 
                          href="#calculator" 
                          onClick={() => setSelectedPackage('elite')}
                          className="block w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-400 to-cyan-500 text-white font-bold text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-sm"
                        >
                          Calculate ROI
                        </a>
                        <Link 
                          href="/contact?source=services&interest=Pro Package"
                          className="block w-full px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-sm"
                        >
                          Lock In Rate
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* ROI Calculator for Individual */}
                <div id="calculator" className="mt-24 max-w-4xl mx-auto bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-indigo-900 rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    Calculate Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Return on Investment</span>
                  </h3>
                  
                  <div className="flex flex-wrap gap-4 justify-center mb-6">
                    <button
                      onClick={() => setSelectedPackage('starter')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedPackage === 'starter' 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Starter Package
                    </button>
                    <button
                      onClick={() => setSelectedPackage('pro')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedPackage === 'pro' 
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Pro Package
                    </button>
                    <button
                      onClick={() => setSelectedPackage('elite')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedPackage === 'elite' 
                          ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Enterprise Package
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8 mb-6">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Set Your Current Metrics</h4>
                      
                      <div className="space-y-5">
                        <div>
                          <label htmlFor="hours-sourcing" className="block text-gray-700 dark:text-gray-200 mb-1 text-sm">
                            Hours per week sourcing
                          </label>
                          <div className="flex items-center">
                            <input 
                              type="range" 
                              id="hours-sourcing" 
                              min="5" 
                              max="40"
                              defaultValue="20"
                              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                              onChange={handleRangeChange}
                            />
                            <span id="hours-sourcing-value" className="ml-3 text-gray-900 dark:text-white font-medium min-w-[40px] text-center">20</span>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="hours-screening" className="block text-gray-700 dark:text-gray-200 mb-1 text-sm">
                            Hours per week screening
                          </label>
                          <div className="flex items-center">
                            <input 
                              type="range" 
                              id="hours-screening" 
                              min="5" 
                              max="30" 
                              defaultValue="15"
                              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                              onChange={handleRangeChange}
                            />
                            <span id="hours-screening-value" className="ml-3 text-gray-900 dark:text-white font-medium min-w-[40px] text-center">15</span>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="avg-submissions" className="block text-gray-700 dark:text-gray-200 mb-1 text-sm">
                            Avg. submissions per week
                          </label>
                          <div className="flex items-center">
                            <input 
                              type="range" 
                              id="avg-submissions" 
                              min="3" 
                              max="20" 
                              defaultValue="8"
                              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                              onChange={handleRangeChange}
                            />
                            <span id="avg-submissions-value" className="ml-3 text-gray-900 dark:text-white font-medium min-w-[40px] text-center">8</span>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="avg-hires" className="block text-gray-700 dark:text-gray-200 mb-1 text-sm">
                            Avg. hires per month
                          </label>
                          <div className="flex items-center">
                            <input 
                              type="range" 
                              id="avg-hires" 
                              min="0.5" 
                              max="5" 
                              step="0.1"
                              defaultValue="1.5"
                              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                              onChange={handleRangeChange}
                            />
                            <span id="avg-hires-value" className="ml-3 text-gray-900 dark:text-white font-medium min-w-[40px] text-center">1.5</span>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="avg-commission" className="block text-gray-700 dark:text-gray-200 mb-1 text-sm">
                            Your placement commission ($)
                          </label>
                          <div className="flex items-center">
                            <input 
                              type="range" 
                              id="avg-commission" 
                              min="1000" 
                              max="20000" 
                              step="500"
                              defaultValue="8000"
                              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                              onChange={handleRangeChange}
                            />
                            <span id="avg-commission-value" className="ml-3 text-gray-900 dark:text-white font-medium min-w-[70px] text-center">$8,000</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">With Our AI Tools</h4>
                      
                      <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
                          <span className="text-gray-700 dark:text-gray-200">Hours per week sourcing</span>
                          <div className="flex items-center">
                            <span className="line-through text-gray-500 dark:text-gray-400 mr-2">{calculatorValues.hoursSourcing}</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">{roi.aiHours.sourcing}</span>
                            <span className="text-green-600 dark:text-green-400 ml-1">(-65%)</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
                          <span className="text-gray-700 dark:text-gray-200">Hours per week screening</span>
                          <div className="flex items-center">
                            <span className="line-through text-gray-500 dark:text-gray-400 mr-2">{calculatorValues.hoursScreening}</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">{roi.aiHours.screening}</span>
                            <span className="text-green-600 dark:text-green-400 ml-1">(-67%)</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
                          <span className="text-gray-700 dark:text-gray-200">Avg. submissions per week</span>
                          <div className="flex items-center">
                            <span className="line-through text-gray-500 dark:text-gray-400 mr-2">{calculatorValues.submissions}</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">{roi.aiSubmissions}</span>
                            <span className="text-green-600 dark:text-green-400 ml-1">(+50%)</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
                          <span className="text-gray-700 dark:text-gray-200">Avg. hires per month</span>
                          <div className="flex items-center">
                            <span className="line-through text-gray-500 dark:text-gray-400 mr-2">{calculatorValues.hires}</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">{roi.aiHires}</span>
                            <span className="text-green-600 dark:text-green-400 ml-1">(+87%)</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
                          <span className="text-gray-700 dark:text-gray-200">Time saved per week</span>
                          <span className="font-semibold text-green-600 dark:text-green-400">{roi.hoursSaved} hours</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-center">Your ROI with {selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1)} Package</h4>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-gray-700 dark:text-gray-200 text-sm mb-1">Package Cost</p>
                        <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                          ${roi.packageCost.toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Setup + 3 months retainer
                        </p>
                      </div>
                      
                      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                        <p className="text-gray-700 dark:text-gray-200 text-sm mb-1">Gross ROI (3 months)</p>
                        <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                          ${Math.round(roi.threeMonthROI).toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          From {roi.additionalHiresPerMonth.toFixed(1)} more placements
                        </p>
                      </div>
                      
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-gray-700 dark:text-gray-200 text-sm mb-1">Net ROI (3 months)</p>
                        <div className="text-xl font-bold text-green-600 dark:text-green-400">
                          ${Math.round(roi.netROI).toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {roi.roiPercentage > 0 ? roi.roiPercentage : 0}% return on investment
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg mb-6">
                      <p className="font-medium text-gray-800 dark:text-white text-center mb-2">ROI Formula</p>
                      <p className="text-sm text-center text-gray-700 dark:text-gray-200">
                        (New hires/mo â€“ Old hires/mo) Ã— Commission Ã— 3 months â€“ Package cost = Net ROI
                      </p>
                    </div>
                    
                    <div className="mt-6 flex justify-center">
                      <Link 
                        href={`/contact?source=services&interest=${packages[selectedPackage].displayName}`}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                      >
                        Get Started with {packages[selectedPackage].displayName}
                      </Link>
                    </div>
                    
                    <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-lg">
                      <p className="text-center text-gray-700 dark:text-gray-200 text-sm">
                        * Calculations based on industry averages with our AI tools. Your results may vary based on market conditions, job types, and individual performance. Most clients achieve these results or better within 30-60 days.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Trusted by section */}
                <div className="mt-16">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                    Trusted by <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Leading Recruiting Firms</span>
                  </h3>
                  
                  <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 max-w-4xl mx-auto">
                    {/* These would be actual logos in a real implementation */}
                    <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">Logo 1</div>
                    <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">Logo 2</div>
                    <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">Logo 3</div>
                    <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">Logo 4</div>
                    <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">Logo 5</div>
                  </div>
                </div>
                
                {/* Testimonials for individual */}
                <div className="mt-24">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-12 text-center">
                    What Individual Recruiters <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Are Saying</span>
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 relative">
                      <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 11l3-3 3 3 4-4" />
                        </svg>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 rounded-full overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
                          <img src="/jessica-p.jpg" alt="Jessica P." className="h-full w-full object-cover" onError={(e) => { e.target.style.display='none'; e.target.nextElementSibling.style.display='flex'; }} />
                          <span className="absolute">JP</span>
                        </div>
                      </div>
                      
                      <div className="text-center mb-6">
                        <p className="font-semibold text-gray-900 dark:text-white">Jessica P.</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Tech Recruiter, Seattle</p>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-100 mb-4 text-center">
                        "I've doubled my placements in just two months."
                      </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 relative">
                      <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 11l3-3 3 3 4-4" />
                        </svg>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 rounded-full overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold">
                          <img src="/david-m.jpg" alt="David M." className="h-full w-full object-cover" onError={(e) => { e.target.style.display='none'; e.target.nextElementSibling.style.display='flex'; }} />
                          <span className="absolute">DM</span>
                        </div>
                      </div>
                      
                      <div className="text-center mb-6">
                        <p className="font-semibold text-gray-900 dark:text-white">David M.</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Executive Recruiter, Chicago</p>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-100 mb-4 text-center">
                        "15+ hours saved per week, best investment in my recruiting career."
                      </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 relative">
                      <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 11l3-3 3 3 4-4" />
                        </svg>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 rounded-full overflow-hidden bg-gradient-to-r from-green-600 to-teal-600 flex items-center justify-center text-white font-bold">
                          <img src="/sarah-k.jpg" alt="Sarah K." className="h-full w-full object-cover" onError={(e) => { e.target.style.display='none'; e.target.nextElementSibling.style.display='flex'; }} />
                          <span className="absolute">SK</span>
                        </div>
                      </div>
                      
                      <div className="text-center mb-6">
                        <p className="font-semibold text-gray-900 dark:text-white">Sarah K.</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Healthcare Recruiter, Dallas</p>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-100 mb-4 text-center">
                        "Cut my time-to-fill from 41 days to just 14 days on average."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Teams & Companies Content */}
            {activeTab === 'teams' && (
              <div id="teams" className="animate-fadeIn">
                <div className="mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white text-center">
                    For <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Teams & Companies</span>
                  </h2>
                  
                  <p className="text-xl text-gray-700 dark:text-gray-200 mb-8 max-w-3xl mx-auto text-center">
                    Transform your entire recruiting operation with custom AI systems that dramatically increase team efficiency and output.
                  </p>
                </div>
                
                {/* Company solution tiers */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {/* Team starter tier */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all duration-300 hover:-translate-y-2">
                    <div className="h-2 bg-gradient-to-r from-blue-400 to-cyan-500"></div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Team Starter</h3>
                      
                      <div className="flex items-baseline mb-6">
                        <span className="text-4xl font-extrabold text-gray-900 dark:text-white">$2,997</span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">one-time</span>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-200 mb-6">
                        For small teams up to 5 recruiters looking to improve efficiency.
                      </p>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">What's included:</h4>
                        <ul className="space-y-2">
                          <BenefitItem text="5 custom AI tools for your team" />
                          <BenefitItem text="Team implementation training" />
                          <BenefitItem text="90 days of support & updates" />
                          <BenefitItem text="Shared AI resource library" />
                          <BenefitItem text="50% faster time-to-hire" />
                        </ul>
                      </div>
                      
                      <Link 
                        href="/contact?plan=team-starter"
                        className="block w-full mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-400 to-cyan-500 text-white font-bold text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                      >
                        Request Info
                      </Link>
                    </div>
                  </div>
                  
                  {/* Team pro tier */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-indigo-500 dark:border-indigo-400 overflow-hidden transform transition-all duration-300 hover:-translate-y-2 relative z-10 scale-105">
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                      MOST POPULAR
                    </div>
                    <div className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Team Pro</h3>
                      
                      <div className="flex items-baseline mb-6">
                        <span className="text-4xl font-extrabold text-gray-900 dark:text-white">$5,997</span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">one-time</span>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-200 mb-6">
                        For mid-sized teams up to 15 recruiters seeking comprehensive AI transformation.
                      </p>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">What's included:</h4>
                        <ul className="space-y-2">
                          <BenefitItem text="10 custom AI tools for your team" />
                          <BenefitItem text="Complete AI workflow automation" />
                          <BenefitItem text="ATS & CRM integrations" />
                          <BenefitItem text="6 months of support & updates" />
                          <BenefitItem text="4 implementation training sessions" />
                          <BenefitItem text="60% faster time-to-hire" />
                        </ul>
                      </div>
                      
                      <Link 
                        href="/contact?plan=team-pro"
                        className="block w-full mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                      >
                        Request Info
                      </Link>
                    </div>
                  </div>
                  
                  {/* Enterprise tier */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all duration-300 hover:-translate-y-2">
                    <div className="h-2 bg-gradient-to-r from-purple-400 to-pink-500"></div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Enterprise</h3>
                      
                      <div className="flex items-baseline mb-6">
                        <span className="text-4xl font-extrabold text-gray-900 dark:text-white">Custom</span>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-200 mb-6">
                        For large teams and enterprises seeking complete AI-driven recruiting transformation.
                      </p>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">What's included:</h4>
                        <ul className="space-y-2">
                          <BenefitItem text="Unlimited custom AI tools" />
                          <BenefitItem text="Full enterprise system integration" />
                          <BenefitItem text="Complete AI recruiting transformation" />
                          <BenefitItem text="Dedicated implementation team" />
                          <BenefitItem text="12 months of support & updates" />
                          <BenefitItem text="70% faster time-to-hire" />
                          <BenefitItem text="Advanced analytics & reporting" />
                        </ul>
                      </div>
                      
                      <Link 
                        href="/contact?plan=enterprise"
                        className="block w-full mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                      >
                        Contact Us
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Case study */}
                <div className="mt-24 max-w-4xl mx-auto bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-indigo-900 rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    Client Success <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Case Study</span>
                  </h3>
                  
                  <div className="mb-8 p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg mr-4">
                        TS
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">TechSource Recruiting</h4>
                        <p className="text-gray-600 dark:text-gray-400">IT Staffing Company â€¢ 12 Recruiters</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Before AI Implementation</h5>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-100">Average time-to-fill: 42 days</span>
                          </li>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-100">5-7 placements per recruiter monthly</span>
                          </li>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-100">30% of time on administrative tasks</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2">After AI Implementation</h5>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-100">Average time-to-fill: 16 days</span>
                          </li>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-100">12-15 placements per recruiter monthly</span>
                          </li>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-100">8% of time on administrative tasks</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        146% Increase in Monthly Revenue
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mt-2">
                        ROI achieved in less than 30 days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Ongoing Support Content */}
            {activeTab === 'support' && (
              <div id="support" className="animate-fadeIn">
                <div className="mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white text-center">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Ongoing Support</span> & Updates
                  </h2>
                  
                  <p className="text-xl text-gray-700 dark:text-gray-200 mb-8 max-w-3xl mx-auto text-center">
                    Stay ahead of the AI curve with continuous support, updates, and enhancements to your AI recruiting toolkit.
                  </p>
                </div>
                
                {/* Support features */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                  <FeatureItem 
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    }
                    title="Monthly Updates"
                    description="Get monthly updates to your AI tools as technology evolves, ensuring you always have cutting-edge capabilities."
                  />
                  
                  <FeatureItem 
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    }
                    title="Expert Support"
                    description="Access to our team of AI experts for troubleshooting, optimization, and strategic guidance for your recruiting AI toolkit."
                  />
                  
                  <FeatureItem 
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    }
                    title="AI Innovation"
                    description="Early access to new recruiting AI technologies and features before they're available to the general public."
                  />
                </div>
                
                {/* Support pricing */}
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                  <div className="p-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                      <div className="mb-4 md:mb-0">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">LexDuo AI Accelerator Program</h3>
                        <p className="text-gray-700 dark:text-gray-200">Ongoing support, updates, and innovation</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-baseline">
                          <span className="text-4xl font-extrabold text-gray-900 dark:text-white">$497</span>
                          <span className="text-gray-500 dark:text-gray-400 ml-2">/ month</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">After any package purchase</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-8">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">What's included:</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <BenefitItem text="Monthly tool updates & improvements" />
                        <BenefitItem text="Priority support via dedicated Slack channel" />
                        <BenefitItem text="Access to our AI recruiting expert community" />
                        <BenefitItem text="Quarterly strategy sessions" />
                        <BenefitItem text="Early access to new AI features" />
                        <BenefitItem text="Monthly AI recruiting trends report" />
                        <BenefitItem text="Regular performance optimization" />
                        <BenefitItem text="Custom tool requests (1 per quarter)" />
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <Link 
                        href="/contact?plan=accelerator"
                        className="inline-block px-8 py-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                      >
                        Join the Accelerator Program
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Guarantee */}
                <div className="mt-24 max-w-4xl mx-auto">
                  <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-1 shadow-lg">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
                      <div className="flex flex-col md:flex-row items-center">
                        <div className="mb-6 md:mb-0 md:mr-8 md:w-1/3">
                          <div className="w-32 h-32 mx-auto bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                        </div>
                        
                        <div className="md:w-2/3">
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Our 100% Performance Guarantee
                          </h3>
                          
                          <p className="text-gray-700 dark:text-gray-100 mb-6">
                            If our AI solutions don't drastically improve your recruiting efficiency within 30 days, we'll refund your investment or continue working with you at no additional cost until we achieve the promised results.
                          </p>
                          
                          <p className="text-gray-700 dark:text-white font-semibold">
                            We don't succeed unless you do.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* FAQ section */}
            <div className="mt-24">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Frequently Asked <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Questions</span>
                </h3>
                <p className="text-gray-700 dark:text-gray-200 max-w-2xl mx-auto">
                  Everything you need to know about our AI services
                </p>
              </div>
              
              <div className="max-w-4xl mx-auto grid gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">How quickly can I expect results from implementing AI tools?</h4>
                  <p className="text-gray-700 dark:text-gray-200">
                    Most clients see significant improvements within the first week of implementation. Our tools are designed for immediate impact, with full ROI typically achieved within 30-60 days depending on your volume and processes.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Do I need technical skills to use these AI tools?</h4>
                  <p className="text-gray-700 dark:text-gray-200">
                    No technical skills required. Our solutions are designed to be user-friendly for recruiters with any level of technical expertise. We provide comprehensive training and support to ensure smooth adoption.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">What is your 100% Satisfaction Guarantee?</h4>
                  <p className="text-gray-700 dark:text-gray-200">
                    If you're not delighted after 60 days, we'll continue optimizing at no extra cost or refund your monthly retainerâ€”your choice. We're committed to your success and stand behind our solutions.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">How do you protect candidate PII and ensure EEO compliance?</h4>
                  <p className="text-gray-700 dark:text-gray-200">
                    All our tools are designed with privacy and compliance as top priorities. We use anonymization techniques for candidate data, implement secure data handling protocols, and ensure all automated processes comply with EEO guidelines and regulations.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Can these tools integrate with my existing ATS/CRM?</h4>
                  <p className="text-gray-700 dark:text-gray-200">
                    Yes, our Team Pro and Enterprise solutions include ATS/CRM integrations. We currently support Bullhorn, Greenhouse, Lever, and many other popular systems. Custom integrations are available for enterprise clients.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">What happens after my retainer period ends?</h4>
                  <p className="text-gray-700 dark:text-gray-200">
                    Your tools remain fully functional indefinitelyâ€”we don't disable or limit them when your support period ends. The monthly retainer simply covers ongoing updates, maintenance, and support. You can choose to renew or cancel at any time.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">What makes your AI solutions different from off-the-shelf AI tools?</h4>
                  <p className="text-gray-700 dark:text-gray-200">
                    Our solutions are custom-built specifically for recruiting workflows and integrate multiple AI technologies into cohesive, purpose-built systems. Unlike generic AI tools, our solutions understand recruiting terminology, processes, and objectives out of the box.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Final CTA */}
            <div id="contact" className="mt-24 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Ready to Transform Your Recruiting with AI?
              </h3>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Link 
                  href="/contact?source=services&interest=Pro Package" 
                  className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  Calculate Your ROI & Get Started
                </Link>
                
                <Link 
                  href="/contact?source=services" 
                  className="inline-flex items-center px-8 py-4 rounded-xl border-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold text-lg shadow hover:shadow-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transform hover:-translate-y-1 transition-all duration-200"
                >
                  Schedule a Consultation
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
