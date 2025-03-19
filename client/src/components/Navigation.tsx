import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Curriculum", href: "#curriculum" },
    { name: "Schedule", href: "#schedule" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <nav className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <svg viewBox="0 0 32 32" className="fill-primary">
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
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                {item.name}
              </a>
            ))}
            <Button
              onClick={() => window.location.href = "/register"}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Register Now
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
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
                className="block py-2 text-foreground/70 hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <Button
              onClick={() => window.location.href = "/register"}
              className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Register Now
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
