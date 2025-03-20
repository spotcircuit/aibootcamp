import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Checkout from "@/pages/Checkout";
import WhatIsAI from "@/pages/What";
import CustomerDashboard from "@/pages/customer/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminEvents from "@/pages/admin/Events";
import AdminLayout from "@/pages/admin/Layout";
import ImagesManagement from "@/pages/admin/Images"; // Added import for ImagesManagement
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/what" component={WhatIsAI} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/dashboard" component={CustomerDashboard} />
      {/* Admin routes */}
      <Route path="/admin">
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </Route>
      <Route path="/admin/users">
        <AdminLayout>
          <div>Users Management</div>
        </AdminLayout>
      </Route>
      <Route path="/admin/events">
        <AdminLayout>
          <AdminEvents />
        </AdminLayout>
      </Route>
      <Route path="/admin/images">
        <AdminLayout>
          <ImagesManagement />
        </AdminLayout>
      </Route>
      <Route path="/admin/payments">
        <AdminLayout>
          <div>Payments Management</div>
        </AdminLayout>
      </Route>
      <Route path="/admin/settings">
        <AdminLayout>
          <div>Admin Settings</div>
        </AdminLayout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;