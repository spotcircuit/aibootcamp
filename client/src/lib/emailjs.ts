import emailjs from '@emailjs/browser';

if (!import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 
    !import.meta.env.VITE_EMAILJS_SERVICE_ID || 
    !import.meta.env.VITE_EMAILJS_TEMPLATE_ID) {
  throw new Error('Missing required EmailJS configuration');
}

emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

export async function sendConfirmationEmail(email: string, name: string) {
  try {
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
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
