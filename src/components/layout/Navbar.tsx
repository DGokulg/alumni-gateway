
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  MessageSquare, 
  Home, 
  Calendar, 
  Users 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full glass backdrop-blur-md border-b border-border/40 transition-all duration-200">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold tracking-tight">
              Alumni Connect
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            to="/profiles"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Profiles
          </Link>
          <Link
            to="/events"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Events
          </Link>
          {isAuthenticated && (
            <Link
              to="/messages"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Messages
            </Link>
          )}
          {isAuthenticated && user?.role === "admin" && (
            <Link
              to="/admin"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Auth actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10 transition-all hover:scale-105">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate(`/profile/${user?.id}`)}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate("/messages")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Messages</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/login")}>Sign Up</Button>
            </>
          )}
          
          {/* Mobile menu trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-x-0 top-16 z-50 md:hidden glass backdrop-blur-lg w-full border-b border-border/40 transition-all duration-300 ease-in-out transform",
          mobileMenuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        )}
      >
        <div className="container px-4 py-4 flex flex-col gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
            onClick={toggleMobileMenu}
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link
            to="/profiles"
            className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
            onClick={toggleMobileMenu}
          >
            <Users className="h-5 w-5" />
            <span>Profiles</span>
          </Link>
          <Link
            to="/events"
            className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
            onClick={toggleMobileMenu}
          >
            <Calendar className="h-5 w-5" />
            <span>Events</span>
          </Link>
          {isAuthenticated && (
            <Link
              to="/messages"
              className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
              onClick={toggleMobileMenu}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Messages</span>
            </Link>
          )}
          {isAuthenticated && user?.role === "admin" && (
            <Link
              to="/admin"
              className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
              onClick={toggleMobileMenu}
            >
              <Settings className="h-5 w-5" />
              <span>Admin</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
