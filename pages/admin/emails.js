import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import ProtectedRoute from '../../components/ProtectedRoute';
import Navigation from '../../components/Navigation';

function EmailsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const templates = [
    { id: 'event-reminder', name: 'Event Reminder' },
    { id: 'welcome', name: 'Welcome Message' },
    { id: 'confirmation', name: 'Registration Confirmation' },
  ];
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is an administrator
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/login');
          return;
        }

        // Query the user profile to check admin status
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        if (!data || !data.is_admin) {
          // User is not an admin, redirect to dashboard
          router.push('/dashboard');
          return;
        }
        
        setIsAdmin(true);
        await fetchUsers();
      } catch (error) {
        console.error('Error checking admin status:', error.message);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [router]);

  const fetchUsers = async () => {
    try {
      // Fetch all users
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  };

  const handleRecipientToggle = (userId) => {
    setSelectedRecipients(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSelectAllRecipients = () => {
    if (selectedRecipients.length === users.length) {
      setSelectedRecipients([]);
    } else {
      setSelectedRecipients(users.map(user => user.id));
    }
  };

  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    setSelectedTemplate(templateId);
    
    // Pre-fill subject and message based on template
    switch (templateId) {
      case 'event-reminder':
        setCustomSubject('Reminder: Upcoming AI Bootcamp Event');
        setCustomMessage('Dear participant,\n\nThis is a friendly reminder about our upcoming AI Bootcamp event. Please make sure to check the schedule and arrive on time.\n\nLooking forward to seeing you,\nThe AI Bootcamp Team');
        break;
      case 'welcome':
        setCustomSubject('Welcome to AI Bootcamp!');
        setCustomMessage('Dear participant,\n\nWelcome to the AI Bootcamp! We\'re excited to have you join us. Here you\'ll find all the resources you need to get started.\n\nBest regards,\nThe AI Bootcamp Team');
        break;
      case 'confirmation':
        setCustomSubject('Your Registration is Confirmed');
        setCustomMessage('Dear participant,\n\nThank you for registering for the AI Bootcamp. Your registration has been confirmed. We look forward to seeing you at the event.\n\nBest regards,\nThe AI Bootcamp Team');
        break;
      default:
        setCustomSubject('');
        setCustomMessage('');
    }
  };

  const validateForm = () => {
    const errors = {};
    if (selectedRecipients.length === 0) errors.recipients = 'Please select at least one recipient';
    if (!customSubject.trim()) errors.subject = 'Subject is required';
    if (!customMessage.trim()) errors.message = 'Message is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSending(true);
    setSuccess(false);
    
    try {
      // In a real application, you would call a secure server-side API endpoint
      // to send emails without exposing email addresses client-side
      
      // For demo purposes, we'll simulate sending emails
      const selectedUsers = users.filter(user => selectedRecipients.includes(user.id));
      const emails = selectedUsers.map(user => user.email).filter(Boolean);
      
      // Simulate API call to send emails
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Log what would be sent (in a real app this would be sent via server)
      console.log('Sending email to:', emails);
      console.log('Subject:', customSubject);
      console.log('Message:', customMessage);
      
      // Record this email in the database
      const { error } = await supabase
        .from('email_logs')
        .insert([
          {
            subject: customSubject,
            body: customMessage,
            recipient_count: selectedRecipients.length,
            template_id: selectedTemplate || null,
            sent_by: (await supabase.auth.getUser()).data.user?.id
          }
        ]);
      
      if (error) throw error;
      
      setSuccess(true);
      // Reset form after successful send
      setSelectedRecipients([]);
      setSelectedTemplate('');
      setCustomSubject('');
      setCustomMessage('');
    } catch (error) {
      console.error('Error sending emails:', error.message);
      alert('Error sending emails. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 dark:bg-gray-700 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Redirecting, so don't render anything
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Email Communications</h1>
            <Link href="/admin" className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              Back to Admin
            </Link>
          </div>
          
          {success && (
            <div className="mb-6 p-4 rounded-md bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-900">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Success!</h3>
                  <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                    <p>Your email has been sent successfully.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-md border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recipients</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Select users to send emails to.</p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between mb-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{selectedRecipients.length} selected</span>
                    <button
                      type="button"
                      onClick={handleSelectAllRecipients}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      {selectedRecipients.length === users.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  
                  {formErrors.recipients && (
                    <p className="mb-4 text-sm text-red-600 dark:text-red-500">{formErrors.recipients}</p>
                  )}
                  
                  <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {users.length === 0 ? (
                        <li className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">No users found</li>
                      ) : (
                        users.map(user => (
                          <li key={user.id} className="px-4 py-3 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                              checked={selectedRecipients.includes(user.id)}
                              onChange={() => handleRecipientToggle(user.id)}
                              id={`user-${user.id}`}
                            />
                            <label htmlFor={`user-${user.id}`} className="ml-3 block">
                              <span className="block text-sm font-medium text-gray-900 dark:text-white">{user.user_metadata.full_name || 'Unnamed User'}</span>
                              <span className="block text-sm text-gray-500 dark:text-gray-400">{user.email}</span>
                            </label>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-md border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Message</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Compose your email message.</p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <form onSubmit={handleSendEmail}>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="template" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Template (Optional)
                        </label>
                        <select
                          id="template"
                          name="template"
                          value={selectedTemplate}
                          onChange={handleTemplateChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 dark:text-white"
                        >
                          <option value="">Select a template...</option>
                          {templates.map(template => (
                            <option key={template.id} value={template.id}>{template.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Subject
                        </label>
                        <input
                          type="text"
                          name="subject"
                          id="subject"
                          value={customSubject}
                          onChange={(e) => setCustomSubject(e.target.value)}
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                        />
                        {formErrors.subject && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formErrors.subject}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows="8"
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                        ></textarea>
                        {formErrors.message && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formErrors.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <button
                          type="submit"
                          disabled={sending}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {sending ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Sending...
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                              </svg>
                              Send Email
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function EmailsAdminPage() {
  return (
    <ProtectedRoute>
      <EmailsAdmin />
    </ProtectedRoute>
  );
}
