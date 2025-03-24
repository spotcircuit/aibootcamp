import { useRouter } from 'next/router';
import Link from 'next/link';
import Navigation from '../../components/Navigation';

export default function PaymentCancel() {
  const router = useRouter();
  const { registration_id } = router.query;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full mb-4">
              <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Payment Cancelled</h1>
            <p className="text-gray-600 dark:text-gray-400">Your payment was cancelled and you have not been charged.</p>
          </div>
          
          <div className="space-y-6">
            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4">
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Your registration is incomplete. If you&apos;d like to try again or have any questions, please use the options below.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {registration_id && (
                  <Link 
                    href={`/events/${registration_id}`} 
                    className="btn btn-primary"
                  >
                    Try Again
                  </Link>
                )}
                
                <Link 
                  href="/events" 
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-3 rounded-lg shadow-md"
                >
                  Browse Events
                </Link>
                
                <Link 
                  href="/" 
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Return to Home
                </Link>
              </div>
              
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-8">
                If you experienced any issues during the payment process, please contact our support team at support@aibootcamp.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}