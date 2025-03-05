
import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={cn("flex min-h-screen flex-col bg-background", className)}>
      <Navbar />
      <div className="flex-1 w-full">{children}</div>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
};

export default Layout;
