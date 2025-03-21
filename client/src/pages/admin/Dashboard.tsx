import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@shared/schema";
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { z } from "zod";

const eventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  price: z.number().min(0, "Price cannot be negative"),
});

type EventFormData = z.infer<typeof eventSchema>;

type DialogMode = "create" | "edit" | "view";

export default function AdminDashboard() {
  const [dialogMode, setDialogMode] = useState<DialogMode>("create");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  const { data: events } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });

  const createForm = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
      capacity: 1,
      price: 0,
    },
  });

  const editForm = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  const createEvent = useMutation({
    mutationFn: async (data: EventFormData) => {
      const res = await apiRequest("POST", "/api/admin/events", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      setIsDialogOpen(false);
      createForm.reset();
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
      const res = await apiRequest("PATCH", `/api/admin/events/${data.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      setIsDialogOpen(false);
      setSelectedEvent(null);
      editForm.reset();
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
    editForm.reset({
      name: event.name,
      startDate: new Date(event.startDate).toISOString().slice(0, 16),
      endDate: new Date(event.endDate).toISOString().slice(0, 16),
      capacity: Number(event.capacity),
      price: Number(event.price),
    });
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const handleView = (event: Event) => {
    setSelectedEvent(event);
    setDialogMode("view");
    setIsDialogOpen(true);
  };

  const handleCreateNew = () => {
    setDialogMode("create");
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleCreateNew}>Create Event</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{events?.length || 0}</p>
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
                <TableHead>Capacity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events?.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <button
                      onClick={() => handleView(event)}
                      className="text-primary hover:underline text-left"
                    >
                      {event.name}
                    </button>
                  </TableCell>
                  <TableCell>{new Date(event.startDate).toLocaleString()}</TableCell>
                  <TableCell>{new Date(event.endDate).toLocaleString()}</TableCell>
                  <TableCell>{event.capacity}</TableCell>
                  <TableCell>${event.price}</TableCell>
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

      {/* Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? "Create New Event" : 
               dialogMode === "edit" ? "Edit Event" : 
               selectedEvent?.name}
            </DialogTitle>
            {dialogMode === "view" && selectedEvent && (
              <DialogDescription>
                Event Details
              </DialogDescription>
            )}
          </DialogHeader>

          {dialogMode === "view" && selectedEvent ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedEvent.startDate).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">End Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedEvent.endDate).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Capacity</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedEvent.capacity} seats
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Price</p>
                  <p className="text-sm text-muted-foreground">
                    ${selectedEvent.price}
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline"
                  onClick={() => handleEdit(selectedEvent)}
                >
                  Edit Event
                </Button>
              </div>
            </div>
          ) : dialogMode === "create" ? (
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit((data) => createEvent.mutate(data))} className="space-y-4">
                <FormField
                  control={createForm.control}
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
                  control={createForm.control}
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
                  control={createForm.control}
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
                  control={createForm.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={createEvent.isPending}>
                  {createEvent.isPending ? "Creating..." : "Create Event"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...editForm}>
              <form 
                onSubmit={editForm.handleSubmit((data) => {
                  if (selectedEvent) {
                    editEvent.mutate({ ...data, id: selectedEvent.id });
                  }
                })} 
                className="space-y-4"
              >
                <FormField
                  control={editForm.control}
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
                  control={editForm.control}
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
                  control={editForm.control}
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
                  control={editForm.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={editEvent.isPending}>
                  {editEvent.isPending ? "Updating..." : "Update Event"}
                </Button>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}