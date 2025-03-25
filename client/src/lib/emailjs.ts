import emailjs from '@emailjs/browser';

const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';

if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
  console.warn('Missing required EmailJS configuration');
}

if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

export async function sendConfirmationEmail(email: string, name: string) {
  try {
    if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
      console.error('EmailJS not properly configured');
      return false;
    }
    
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: email,
        to_name: name,
        course_name: "AI Basics Bootcamp",
        start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      }
    );
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}