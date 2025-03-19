import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What prerequisites do I need?",
    answer: "No prior AI experience is required! Basic programming knowledge is helpful but not mandatory. We'll teach you everything you need to know from the ground up."
  },
  {
    question: "How are the sessions structured?",
    answer: "Each week includes two live sessions (2 hours each) with hands-on exercises, project work, and 1:1 mentoring. You'll also have access to recorded sessions and practice materials."
  },
  {
    question: "What tools will I learn to use?",
    answer: "You'll gain hands-on experience with popular AI tools like ChatGPT, DALL-E, Midjourney, Stable Diffusion, and learn how to integrate them into your workflow. We'll also cover prompt engineering and API integration."
  },
  {
    question: "Will I get a certificate?",
    answer: "Yes! Upon completion, you'll receive a verified certificate showcasing your AI skills and the projects you've completed during the bootcamp."
  },
  {
    question: "What kind of support is available?",
    answer: "You'll have access to experienced mentors, a community of fellow learners, and ongoing support through our discussion forums. Plus, weekly 1:1 sessions for personalized guidance."
  },
  {
    question: "Can I attend part-time?",
    answer: "Yes! While we recommend following the schedule, all sessions are recorded and materials are available 24/7. You can learn at your own pace within the 12-week period."
  }
];

export default function FAQ() {
  return (
    <section id="faq" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
