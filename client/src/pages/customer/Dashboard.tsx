import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EventCalendar from "@/components/EventCalendar";
import type { Event } from "@shared/schema";
import { CalendarIcon, ClockIcon, CreditCardIcon } from "@heroicons/react/24/outline";

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
          {/* Calendar Section */}
          <section>
            <EventCalendar />
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