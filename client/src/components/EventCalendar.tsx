import { useState } from 'react';
import { useLocation } from 'wouter';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Event } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function EventCalendar() {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const { data: events } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });

  // Fetch registrations to check registration status
  const { data: registrations } = useQuery<{ eventId: number, isPaid: boolean }[]>({
    queryKey: ['/api/registrations'],
  });

  const registerForEvent = useMutation({
    mutationFn: async (eventId: number) => {
      const res = await apiRequest("POST", "/api/register-event", { eventId });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Registration initiated",
        description: "Proceeding to payment...",
      });
      navigate(`/checkout?registrationId=${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Convert our events to FullCalendar format
  const calendarEvents = events?.map(event => ({
    id: event.id.toString(),
    title: event.name,
    start: event.startDate,
    end: event.endDate,
    extendedProps: {
      capacity: event.capacity,
      price: event.price,
      event: event, // Store the full event object
    }
  }));

  const isRegistered = (eventId: number) => {
    return registrations?.some(reg => 
      reg.eventId === eventId && reg.isPaid
    ) || false;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Event Schedule</h2>
        <div className="space-x-2">
          <Button
            className={view === 'calendar' ? '' : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'}
            onClick={() => setView('calendar')}
          >
            Calendar View
          </Button>
          <Button
            className={view === 'list' ? '' : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'}
            onClick={() => setView('list')}
          >
            List View
          </Button>
        </div>
      </div>

      {view === 'calendar' ? (
        <Card>
          <CardContent className="pt-6">
            <FullCalendar
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listPlugin
              ]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={calendarEvents}
              height="auto"
              eventClick={(info) => {
                const event = info.event.extendedProps.event;
                setSelectedEvent(event);
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events?.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell>
                      {new Date(event.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(event.startDate).toLocaleTimeString()} - 
                      {new Date(event.endDate).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>{event.capacity}</TableCell>
                    <TableCell>${event.price}</TableCell>
                    <TableCell>
                      {isRegistered(event.id) ? (
                        <span className="text-green-600 font-medium">Registered</span>
                      ) : (
                        <span className="text-muted-foreground">Not Registered</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        className="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                        size="sm"
                        onClick={() => setSelectedEvent(event)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.name}</DialogTitle>
            <DialogDescription>
              {new Date(selectedEvent?.startDate || '').toLocaleDateString()} - {new Date(selectedEvent?.endDate || '').toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Start Time</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedEvent?.startDate || '').toLocaleTimeString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">End Time</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedEvent?.endDate || '').toLocaleTimeString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Capacity</p>
                <p className="text-sm text-muted-foreground">
                  {selectedEvent?.capacity} seats
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Price</p>
                <p className="text-sm text-muted-foreground">
                  ${selectedEvent?.price}
                </p>
              </div>
            </div>

            {selectedEvent && (
              <div className="flex justify-end space-x-2 pt-4">
                {isRegistered(selectedEvent.id) ? (
                  <Button disabled className="border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                    Already Registered
                  </Button>
                ) : (
                  <Button 
                    className="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    onClick={() => {
                      registerForEvent.mutate(selectedEvent.id);
                      setSelectedEvent(null);
                    }}
                    disabled={registerForEvent.isPending}
                  >
                    {registerForEvent.isPending ? "Processing..." : "Register Now"}
                  </Button>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}