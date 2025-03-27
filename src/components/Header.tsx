
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ease-out-expo",
        scrolled
          ? "bg-white/70 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            ProjectAI
          </span>
        </div>

        <nav className="hidden md:flex space-x-8">
          <a
            href="#features"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#workflow"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            How It Works
          </a>
          <a
            href="#get-started"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Get Started
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Sign In
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors">
            Join Waitlist
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
