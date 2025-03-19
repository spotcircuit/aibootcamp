import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Checkout from "@/pages/Checkout";
import CustomerDashboard from "@/pages/customer/Dashboard";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminLayout from "@/pages/admin/Layout";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/dashboard" component={CustomerDashboard} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard">
        {() => (
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        )}
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