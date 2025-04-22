import Navigation from '../components/Navigation';
import Image from 'next/image';

export default function Help() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <Navigation />
        <div className="container mx-auto px-4 py-8 bg-white/20 backdrop-blur-lg rounded-xl shadow-lg border border-white/30">
          <h1 className="text-3xl font-bold mb-4">Help & Documentation</h1>
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded mb-6">
            To ensure you receive our emails, please add <code>aibootcamp@lexduo.ai</code> and <code>@lexduo.ai</code> to your email&#39;s safe sender or non‑spam list.
          </div>

          <h2 className="text-2xl font-semibold mb-2">1. Complete Your Profile</h2>
          <p>Fill out your profile information as shown below:</p>
          <Image
            src="/registration.jpg"
            alt="Profile Form"
            width={800}
            height={600}
            className="w-full max-w-xl h-auto border border-gray-300 rounded mb-8 mx-auto"
          />

          <h2 className="text-2xl font-semibold mb-2">2. Dashboard</h2>
          <p>View your events and registrations in your dashboard:</p>
          <Image
            src="/dashboard.jpg"
            alt="User Dashboard"
            width={800}
            height={600}
            className="w-full max-w-xl h-auto border border-gray-300 rounded mb-8 mx-auto"
          />

          <h2 className="text-2xl font-semibold mb-2">3. Register for an Event</h2>
          <p>Click “Register” on an event and fill out the form:</p>
          <Image
            src="/registeringevent.jpg"
            alt="Event Registration Form"
            width={800}
            height={600}
            className="w-full max-w-xl h-auto border border-gray-300 rounded mb-8 mx-auto"
          />

          <h2 className="text-2xl font-semibold mb-2">4. Payment</h2>
          <p>On the payment page, click “Pay Here” to complete your registration:</p>
          <Image
            src="/payhere.jpg"
            alt="Payment Page"
            width={800}
            height={600}
            className="w-full max-w-xl h-auto border border-gray-300 rounded mb-8 mx-auto"
          />

          <h2 className="text-2xl font-semibold mb-2">5. Registration Success</h2>
          <p>After successful registration, you’ll see this confirmation:</p>
          <Image
            src="/successfulregister.jpg"
            alt="Registration Success"
            width={800}
            height={600}
            className="w-full max-w-xl h-auto border border-gray-300 rounded mb-8 mx-auto"
          />

          <h2 className="text-2xl font-semibold mb-2">Admin Notifications</h2>
          <p>
            You should receive a confirmation email after creating your profile or registering for an event. If you don&#39;t get an email, don&#39;t worry—we monitor all registrations and will follow up as needed.
          </p>
        </div>
      </div>
    </>
  );
}
