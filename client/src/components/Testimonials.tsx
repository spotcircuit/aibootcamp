import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Data Scientist",
    content: "The AI Basics Bootcamp provided me with a solid foundation in AI concepts. The hands-on projects were invaluable.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    content: "Excellent curriculum and supportive instructors. I now feel confident working with AI technologies.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  },
  {
    name: "Emily Rodriguez",
    role: "Product Manager",
    content: "This bootcamp helped me understand AI from a business perspective. Great investment!",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
  },
  {
    name: "David Kim",
    role: "ML Engineer",
    content: "The practical approach to learning made complex concepts easy to understand.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
  },
  {
    name: "Lisa Thompson",
    role: "Business Analyst",
    content: "I had no technical background, but the bootcamp made AI accessible and engaging.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
  },
  {
    name: "James Wilson",
    role: "Tech Lead",
    content: "The quality of instruction and course materials exceeded my expectations.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
  },
  {
    name: "Anna Martinez",
    role: "Research Scientist",
    content: "A comprehensive program that covers both theoretical and practical aspects of AI.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16">
      <h2 className="text-3xl font-bold text-center mb-12">
        What Our Students Say
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.name}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-muted-foreground">{testimonial.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
