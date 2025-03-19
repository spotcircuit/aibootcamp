import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ClockIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import type { Event } from "@shared/schema";

export default function CustomerDashboard() {
  const { data: events } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">My Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          {/* Upcoming Events Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Available Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events?.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{event.name}</span>
                      <span className="text-lg text-primary">${event.price}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarIcon className="w-5 h-5" />
                        <span>
                          {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <ClockIcon className="w-5 h-5" />
                        <span>{new Date(event.startDate).toLocaleTimeString()} - {new Date(event.endDate).toLocaleTimeString()}</span>
                      </div>
                      <Button className="w-full gap-2">
                        <CreditCardIcon className="w-5 h-5" />
                        Register Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* My Registrations Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">My Registrations</h2>
            <Card>
              <CardContent className="py-6">
                <p className="text-muted-foreground text-center">
                  You haven't registered for any events yet.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
