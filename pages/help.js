import Navigation from '../components/Navigation';
import { useContext } from 'react';
import { ThemeContext } from './_app';

export default function Help() {
  const { darkMode } = useContext(ThemeContext);
  
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900 p-8">
        <Navigation />
        <div className="container mx-auto px-4 py-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg border border-indigo-100 dark:border-indigo-900/30">
          <h1 className="text-3xl font-bold mb-4 text-indigo-800 dark:text-white">Help & Documentation</h1>
          <div className="bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300 p-4 rounded mb-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>To ensure you receive our emails, please add <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">aibootcamp@lexduo.ai</code> and <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">@lexduo.ai</code> to your email's safe sender or non‑spam list.</p>
            </div>
          </div>

          {/* Section 1: Complete Your Profile */}
          <div className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">1</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Complete Your Profile</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">Fill out your profile information to get started with our AI bootcamp.</p>
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-6 relative">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-full md:w-1/2">
                  <svg className="w-full h-auto" viewBox="0 0 400 350" xmlns="http://www.w3.org/2000/svg">
                    {/* Form Container */}
                    <rect x="50" y="30" width="300" height="290" rx="8" fill={darkMode ? "#1e293b" : "#f8fafc"} stroke={darkMode ? "#4f46e5" : "#6366f1"} strokeWidth="2"/>
                    
                    {/* Form Title */}
                    <text x="70" y="55" fontSize="16" fontWeight="bold" fill={darkMode ? "#e0e7ff" : "#4338ca"}>Profile Information</text>
                    
                    {/* Name Field */}
                    <text x="70" y="85" fontSize="12" fill={darkMode ? "#94a3b8" : "#4b5563"}>Name</text>
                    <rect x="70" y="95" width="260" height="25" rx="4" fill={darkMode ? "#334155" : "#e0e7ff"} />
                    <text x="80" y="112" fontSize="12" fill={darkMode ? "#cbd5e1" : "#4b5563"}>John Smith</text>
                    
                    {/* Email Field */}
                    <text x="70" y="135" fontSize="12" fill={darkMode ? "#94a3b8" : "#4b5563"}>Email Address</text>
                    <rect x="70" y="145" width="260" height="25" rx="4" fill={darkMode ? "#334155" : "#e0e7ff"} />
                    <text x="80" y="162" fontSize="12" fill={darkMode ? "#cbd5e1" : "#4b5563"}>john.smith@example.com</text>
                    
                    {/* Role Field */}
                    <text x="70" y="185" fontSize="12" fill={darkMode ? "#94a3b8" : "#4b5563"}>Professional Role</text>
                    <rect x="70" y="195" width="260" height="25" rx="4" fill={darkMode ? "#334155" : "#e0e7ff"} />
                    <text x="80" y="212" fontSize="12" fill={darkMode ? "#cbd5e1" : "#4b5563"}>Data Scientist</text>
                    
                    {/* Industry & Experience Fields */}
                    <text x="70" y="235" fontSize="12" fill={darkMode ? "#94a3b8" : "#4b5563"}>Industry</text>
                    <rect x="70" y="245" width="120" height="25" rx="4" fill={darkMode ? "#334155" : "#e0e7ff"} />
                    <text x="80" y="262" fontSize="12" fill={darkMode ? "#cbd5e1" : "#4b5563"}>Technology</text>
                    
                    <text x="210" y="235" fontSize="12" fill={darkMode ? "#94a3b8" : "#4b5563"}>Experience</text>
                    <rect x="210" y="245" width="120" height="25" rx="4" fill={darkMode ? "#334155" : "#e0e7ff"} />
                    <text x="220" y="262" fontSize="12" fill={darkMode ? "#cbd5e1" : "#4b5563"}>3-5 years</text>
                    
                    {/* Save Button */}
                    <rect x="240" y="285" width="90" height="30" rx="4" fill={darkMode ? "#4f46e5" : "#6366f1"} />
                    <text x="285" y="305" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">Save</text>
                  </svg>
                </div>
                <div className="w-full md:w-1/2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Profile Tips:</h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Use your professional email for better communication
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Add your industry to help us tailor content
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Include your role to connect with similar professionals
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Dashboard */}
          <div className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">2</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">View your events and registrations in your personalized dashboard.</p>
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-6 relative">
              <svg className="w-full h-auto" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
                {/* Dashboard Container */}
                <rect x="20" y="20" width="560" height="260" rx="8" fill={darkMode ? "#1e293b" : "#f8fafc"} stroke={darkMode ? "#4f46e5" : "#6366f1"} strokeWidth="2"/>
                
                {/* Dashboard Header */}
                <text x="40" y="45" fontSize="18" fontWeight="bold" fill={darkMode ? "#e0e7ff" : "#4338ca"}>My AI Bootcamp Dashboard</text>
                
                {/* Upcoming Events Card */}
                <rect x="40" y="60" width="200" height="100" rx="6" fill={darkMode ? "#334155" : "#e0e7ff"} />
                <text x="140" y="85" fontSize="14" fontWeight="bold" fill={darkMode ? "#e0e7ff" : "#4338ca"} textAnchor="middle">Upcoming Events</text>
                <text x="140" y="110" fontSize="12" fill={darkMode ? "#cbd5e1" : "#4b5563"} textAnchor="middle">AI Basics Bootcamp</text>
                <text x="140" y="135" fontSize="12" fill={darkMode ? "#cbd5e1" : "#4b5563"} textAnchor="middle">May 30, 2025 - 2:00 PM</text>
                
                {/* My Registrations Card */}
                <rect x="260" y="60" width="150" height="100" rx="6" fill={darkMode ? "#334155" : "#e0e7ff"} />
                <text x="335" y="85" fontSize="14" fontWeight="bold" fill={darkMode ? "#e0e7ff" : "#4338ca"} textAnchor="middle">My Registrations</text>
                <text x="335" y="110" fontSize="12" fill={darkMode ? "#cbd5e1" : "#4b5563"} textAnchor="middle">1 Active Registration</text>
                <text x="335" y="135" fontSize="12" fill={darkMode ? "#cbd5e1" : "#4b5563"} textAnchor="middle">Payment Complete</text>
                
                {/* Resources Card */}
                <rect x="430" y="60" width="130" height="100" rx="6" fill={darkMode ? "#334155" : "#e0e7ff"} />
                <text x="495" y="85" fontSize="14" fontWeight="bold" fill={darkMode ? "#e0e7ff" : "#4338ca"} textAnchor="middle">Resources</text>
                <text x="495" y="110" fontSize="12" fill={darkMode ? "#cbd5e1" : "#4b5563"} textAnchor="middle">Course Materials</text>
                <text x="495" y="135" fontSize="12" fill={darkMode ? "#cbd5e1" : "#4b5563"} textAnchor="middle">Downloads (2)</text>
                
                {/* Event Details Panel */}
                <rect x="40" y="180" width="520" height="80" rx="6" fill={darkMode ? "#334155" : "#e0e7ff"} />
                <text x="300" y="210" fontSize="14" fontWeight="bold" fill={darkMode ? "#e0e7ff" : "#4338ca"} textAnchor="middle">AI Basics Bootcamp - May 30, 2025</text>
                <text x="300" y="235" fontSize="12" fill={darkMode ? "#cbd5e1" : "#4b5563"} textAnchor="middle">Instructor: Dr. Sarah Johnson | Virtual Meeting | Meeting Link Available</text>
              </svg>
            </div>
          </div>

          {/* Section 3: Register for an Event - Step 1: View Event Details */}
          <div className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">3</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Register for an Event</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">The registration process has two main steps: viewing event details, then completing registration.</p>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Step 1: View Event Details</h3>
              <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-6 relative">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="w-full md:w-1/2">
                    <svg className="w-full h-auto" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                      {/* Event Details Container */}
                      <rect x="50" y="30" width="300" height="240" rx="8" fill={darkMode ? "#1e293b" : "#f8fafc"} stroke={darkMode ? "#4f46e5" : "#6366f1"} strokeWidth="2"/>
                      
                      {/* Event Title */}
                      <text x="200" y="55" fontSize="16" fontWeight="bold" fill={darkMode ? "#e0e7ff" : "#4338ca"} textAnchor="middle">AI Basics Bootcamp</text>
                      
                      {/* Event Image Placeholder */}
                      <rect x="70" y="70" width="260" height="80" rx="4" fill={darkMode ? "#334155" : "#e0e7ff"} />
                      <text x="200" y="115" fontSize="12" fill={darkMode ? "#cbd5e1" : "#4b5563"} textAnchor="middle">Event Image</text>
                      
                      {/* Event Details */}
                      <text x="70" y="170" fontSize="12" fill={darkMode ? "#94a3b8" : "#4b5563"}>Date & Time</text>
                      <text x="70" y="190" fontSize="12" fill={darkMode ? "#cbd5e1" : "#4b5563"}>May 30, 2025 - 2:00 PM EST</text>
                      
                      <text x="70" y="210" fontSize="12" fill={darkMode ? "#94a3b8" : "#4b5563"}>Price</text>
                      <text x="70" y="230" fontSize="12" fill={darkMode ? "#cbd5e1" : "#4b5563"}>$199.00</text>
                      
                      {/* Register Button */}
                      <rect x="200" y="210" width="130" height="40" rx="4" fill={darkMode ? "#4f46e5" : "#6366f1"} />
                      <text x="265" y="235" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">Register</text>
                    </svg>
                  </div>
                  <div className="w-full md:w-1/2">
                    <h4 className="text-md font-medium text-gray-800 dark:text-white mb-2">Event Information:</h4>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>View upcoming workshop dates and times</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Read detailed workshop descriptions</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                        <span>Check pricing and available spots</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Click the "Register" button to proceed</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Step 2: Complete Registration Form</h3>
              <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-6 relative">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="w-full md:w-1/2">
                    <svg className="w-full h-auto" viewBox="0 0 400 350" xmlns="http://www.w3.org/2000/svg">
                      {/* Form Container */}
                      <rect x="50" y="30" width="300" height="290" rx="8" fill={darkMode ? "#1e293b" : "#f8fafc"} stroke={darkMode ? "#4f46e5" : "#6366f1"} strokeWidth="2"/>
                      
                      {/* Form Title */}
                      <text x="200" y="55" fontSize="16" fontWeight="bold" fill={darkMode ? "#e0e7ff" : "#4338ca"} textAnchor="middle">Complete Registration</text>
                      
                      {/* Name Field */}
                      <text x="70" y="80" fontSize="12" fill={darkMode ? "#94a3b8" : "#4b5563"}>Full Name</text>
                      <rect x="70" y="90" width="260" height="35" rx="4" fill={darkMode ? "#334155" : "#e0e7ff"} />
                      <text x="85" y="112" fontSize="12" fill={darkMode ? "#cbd5e1" : "#4b5563"}>John Smith</text>
                      
                      {/* Email Field */}
                      <text x="70" y="145" fontSize="12" fill={darkMode ? "#94a3b8" : "#4b5563"}>Email</text>
                      <rect x="70" y="155" width="260" height="35" rx="4" fill={darkMode ? "#334155" : "#e0e7ff"} />
                      <text x="85" y="177" fontSize="12" fill={darkMode ? "#cbd5e1" : "#4b5563"}>john.smith@example.com</text>
                      
                      {/* Phone Field */}
                      <text x="70" y="210" fontSize="12" fill={darkMode ? "#94a3b8" : "#4b5563"}>Phone (optional)</text>
                      <rect x="70" y="220" width="260" height="35" rx="4" fill={darkMode ? "#334155" : "#e0e7ff"} />
                      <text x="85" y="242" fontSize="12" fill={darkMode ? "#94a3b8" : "#6b7280"}>Enter phone number...</text>
                      
                      {/* Register Button */}
                      <rect x="70" y="275" width="260" height="35" rx="4" fill={darkMode ? "#4f46e5" : "#6366f1"} />
                      <text x="200" y="297" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">Register Now</text>
                    </svg>
                  </div>
                  <div className="w-full md:w-1/2">
                    <h4 className="text-md font-medium text-gray-800 dark:text-white mb-2">Registration Process:</h4>
                    <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-2">
                          <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">1</span>
                        </div>
                        <span>Fill out your personal information</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-2">
                          <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">2</span>
                        </div>
                        <span>Click "Register Now" to confirm</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-2">
                          <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">3</span>
                        </div>
                        <span>You'll be redirected to the payment page</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-2">
                          <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">4</span>
                        </div>
                        <span>After payment, you'll receive a confirmation email</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Payment */}
          <div className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">4</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Payment</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">On the payment page, click "Pay Here" to complete your registration.</p>
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-6 relative">
              <svg className="w-full h-auto" viewBox="0 0 500 250" xmlns="http://www.w3.org/2000/svg">
                {/* Payment Page Container */}
                <rect x="50" y="20" width="400" height="210" rx="8" fill={darkMode ? "#1e293b" : "#f8fafc"} stroke={darkMode ? "#4f46e5" : "#6366f1"} strokeWidth="2"/>
                
                {/* Page Title */}
                <text x="250" y="45" fontSize="18" fontWeight="bold" fill={darkMode ? "#e0e7ff" : "#4338ca"} textAnchor="middle">Complete Your Registration</text>
                
                {/* Event Details */}
                <rect x="70" y="60" width="360" height="50" rx="4" fill={darkMode ? "#334155" : "#e0e7ff"} />
                <text x="250" y="90" fontSize="16" fontWeight="bold" fill={darkMode ? "#e0e7ff" : "#4338ca"} textAnchor="middle">AI Basics Bootcamp - $199</text>
                
                {/* Payment Details */}
                <text x="100" y="130" fontSize="14" fill={darkMode ? "#94a3b8" : "#4b5563"}>Secure Payment • All Major Cards Accepted</text>
                
                {/* Payment Icons */}
                <rect x="70" y="140" width="30" height="20" rx="2" fill={darkMode ? "#475569" : "#cbd5e1"} />
                <rect x="105" y="140" width="30" height="20" rx="2" fill={darkMode ? "#475569" : "#cbd5e1"} />
                <rect x="140" y="140" width="30" height="20" rx="2" fill={darkMode ? "#475569" : "#cbd5e1"} />
                
                {/* Pay Button */}
                <rect x="180" y="130" width="140" height="60" rx="4" fill={darkMode ? "#4f46e5" : "#6366f1"} />
                <text x="250" y="165" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle">Pay Here</text>
                
                {/* Security Note */}
                <text x="250" y="210" fontSize="12" fill={darkMode ? "#94a3b8" : "#6b7280"} textAnchor="middle">Secure payment processing • Your information is protected</text>
              </svg>
            </div>
          </div>

          {/* Section 5: Registration Success */}
          <div className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">5</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Registration Success</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">After successful registration, you'll see this confirmation.</p>
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-6 relative">
              <div className="flex justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Registration Successful!</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">You're all set for the AI Basics Bootcamp on May 30, 2025.</p>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">A confirmation email has been sent to your registered email address.</p>
                  <div className="flex justify-center">
                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                      View My Events
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Notifications */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Admin Notifications</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You should receive a confirmation email after creating your profile or registering for an event. If you don't get an email, don't worry—we monitor all registrations and will follow up as needed.
              </p>
              <div className="flex items-start bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-blue-800 dark:text-blue-200">
                  Need help? Contact us at <a href="mailto:support@lexduo.ai" className="font-medium underline">support@lexduo.ai</a> or use the chat button in the bottom right corner of any page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}