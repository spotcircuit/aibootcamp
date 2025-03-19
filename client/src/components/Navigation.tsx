import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Bars3Icon as MenuIcon,
  XMarkIcon as CloseIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { Brain } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { name: "Home", href: "/", icon: <AcademicCapIcon className="w-5 h-5" /> },
    { name: "What is AI?", href: "/what", icon: <Brain className="w-5 h-5" /> },
    { name: "Curriculum", href: "#curriculum", icon: <BookOpenIcon className="w-5 h-5" /> },
    { name: "Schedule", href: "#schedule", icon: <CalendarIcon className="w-5 h-5" /> },
    { name: "Testimonials", href: "#testimonials", icon: <ChatBubbleLeftRightIcon className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <svg viewBox="0 0 32 32" className="fill-primary-foreground">
                <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0zm0 24c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"/>
              </svg>
            </div>
            <span className="font-bold text-xl">AI Bootcamp</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-primary-foreground/90 hover:text-primary-foreground transition-colors flex items-center gap-2"
              >
                {item.icon}
                <span>{item.name}</span>
              </a>
            ))}
            <div className="flex items-center gap-4">
              <a href="#faq" className="text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                <QuestionMarkCircleIcon className="w-5 h-5" />
              </a>
              <Link href="/admin" className="text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                <ShieldCheckIcon className="w-5 h-5" />
              </Link>
              <Button
                onClick={() => window.location.href = "/register"}
                variant="secondary"
                className="bg-background text-foreground hover:bg-background/90"
              >
                Register Now
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-primary-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block py-2 text-primary-foreground/90 hover:text-primary-foreground flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </a>
            ))}
            <div className="flex items-center gap-4 py-2">
              <a href="#faq" className="text-primary-foreground/90 hover:text-primary-foreground">
                <QuestionMarkCircleIcon className="w-5 h-5" />
              </a>
              <Link href="/admin" className="text-primary-foreground/90 hover:text-primary-foreground">
                <ShieldCheckIcon className="w-5 h-5" />
              </Link>
            </div>
            <Button
              onClick={() => window.location.href = "/register"}
              variant="secondary"
              className="w-full mt-4 bg-background text-foreground hover:bg-background/90"
            >
              Register Now
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}