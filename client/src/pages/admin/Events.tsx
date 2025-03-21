import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, UsersIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";

// Update the event schema
const eventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  location: z.string().min(1, "Location is required"),
  duration: z.string().min(1, "Duration is required"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  contact: z.string().min(1, "Contact information is required"),
  agenda: z.string().min(1, "Agenda is required"),
  inclusions: z.string().optional(),
  bonus: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;
type Event = EventFormData & { id: number };

const initialEvents = [
  {
    name: "AI Basics Bootcamp",
    startDate: "2025-03-28T09:00:00",
    endDate: "2025-03-28T11:00:00",
    location: "Virtual",
    duration: "2 Hours",
    capacity: 50,
    price: 199,
    contact: "Mike@ai-made-ez.com",
    agenda: `What IS AI

Step by Step directions on building your own tools specifically

Build an AI Recruiter AND an AI Analyst

Learn how to use Animation how to bring your AI to life!

AI Empowered Tools Review

*No coding required!`,
    inclusions: "Copies of The AI Recruiter & The AI Analyst",
    bonus: "30 minutes of networking",
    id: 1, //Adding ID for consistency
  },
  {
    name: "Advanced AI Implementation Workshop",
    startDate: "2025-04-15T10:00:00",
    endDate: "2025-04-15T12:00:00",
    location: "Virtual",
    duration: "2 Hours",
    capacity: 50,
    price: 199,
    contact: "Mike@ai-made-ez.com",
    agenda: "Hands-on workshop for implementing AI tools in your workflow\nAdvanced prompting techniques\nReal-world case studies",
    inclusions: "Workshop materials and templates",
    bonus: "15-minute 1:1 consultation",
    id: 2, //Adding ID for consistency
  },
  {
    name: "AI Strategy Masterclass",
    startDate: "2025-05-01T14:00:00",
    endDate: "2025-05-01T16:00:00",
    location: "Virtual",
    duration: "2 Hours",
    capacity: 50,
    price: 199,
    contact: "Mike@ai-made-ez.com",
    agenda: "Strategic implementation of AI tools\nWorkflow optimization\nTeam training best practices",
    inclusions: "Strategy planning templates",
    bonus: "Access to exclusive AI tools library",
    id: 3, //Adding ID for consistency
  },
];


export default function EventsManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  const { data: events = initialEvents } = useQuery<Event[]>({ // Added initialEvents as default
    queryKey: ['/api/events'],
  });

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
      location: "",
      duration: "",
      capacity: 1,
      price: 0,
      contact: "",
      agenda: "",
      inclusions: "",
      bonus: "",
    },
  });

  const createEvent = useMutation({
    mutationFn: async (data: EventFormData) => {
      const res = await apiRequest("POST", "/api/events", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Event created",
        description: "The event has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const editEvent = useMutation({
    mutationFn: async (data: EventFormData & { id: number }) => {
      const res = await apiRequest("PATCH", `/api/events/${data.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      setIsDialogOpen(false);
      setSelectedEvent(null);
      form.reset();
      toast({
        title: "Event updated",
        description: "The event has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    form.reset({
      name: event.name,
      startDate: new Date(event.startDate).toISOString().slice(0, 16),
      endDate: new Date(event.endDate).toISOString().slice(0, 16),
      location: event.location,
      duration: event.duration,
      capacity: Number(event.capacity),
      price: Number(event.price),
      contact: event.contact,
      agenda: event.agenda,
      inclusions: event.inclusions,
      bonus: event.bonus,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Events Management</h1>
        <Button onClick={() => {
          setSelectedEvent(null);
          form.reset();
          setIsDialogOpen(true);
        }}>
          Create Event
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Events
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Capacity
            </CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events?.reduce((sum, event) => sum + event.capacity, 0) || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Price
            </CardTitle>
            <CurrencyDollarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${events?.length ? (events.reduce((sum, event) => sum + event.price, 0) / events.length).toFixed(2) : '0.00'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Agenda</TableHead>
                <TableHead>Inclusions</TableHead>
                <TableHead>Bonus</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events?.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{new Date(event.startDate).toLocaleString()}</TableCell>
                  <TableCell>{new Date(event.endDate).toLocaleString()}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{event.duration}</TableCell>
                  <TableCell>{event.capacity}</TableCell>
                  <TableCell>${event.price}</TableCell>
                  <TableCell>{event.contact}</TableCell>
                  <TableCell>{event.agenda}</TableCell>
                  <TableCell>{event.inclusions}</TableCell>
                  <TableCell>{event.bonus}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(event)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? "Edit Event" : "Create New Event"}
            </DialogTitle>
            <DialogDescription>
              {selectedEvent ? "Update event details" : "Add a new event to the system"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => {
                if (selectedEvent) {
                  editEvent.mutate({ ...data, id: selectedEvent.id });
                } else {
                  createEvent.mutate(data);
                }
              })}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="agenda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agenda</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inclusions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inclusions</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bonus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bonus</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {selectedEvent ? "Update Event" : "Create Event"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}