import { PropsWithChildren } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ChartBarIcon,
  UsersIcon,
  CalendarIcon,
  CreditCardIcon,
  Cog8ToothIcon,
} from "@heroicons/react/24/outline";

const sidebarItems = [
  { name: "Dashboard", href: "/admin", icon: <ChartBarIcon className="w-5 h-5" /> },
  { name: "Users", href: "/admin/users", icon: <UsersIcon className="w-5 h-5" /> },
  { name: "Events", href: "/admin/events", icon: <CalendarIcon className="w-5 h-5" /> },
  { name: "Payments", href: "/admin/payments", icon: <CreditCardIcon className="w-5 h-5" /> },
  { name: "Settings", href: "/admin/settings", icon: <Cog8ToothIcon className="w-5 h-5" /> },
];

export default function AdminLayout({ children }: PropsWithChildren) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-2 mb-8">
          <ChartBarIcon className="w-8 h-8" />
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                location === item.href
                  ? "bg-primary-foreground text-primary"
                  : "hover:bg-primary-foreground/10"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-background">
        {children}
      </main>
    </div>
  );
}