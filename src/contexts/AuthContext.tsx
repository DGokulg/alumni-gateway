
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";

export type UserRole = "admin" | "student" | "alumni";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  connections?: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    avatar: "https://i.pravatar.cc/150?img=1",
    connections: [],
  },
  {
    id: "2",
    name: "Student User",
    email: "student@example.com",
    role: "student",
    avatar: "https://i.pravatar.cc/150?img=2",
    connections: ["3", "4", "5"],
  },
  {
    id: "3",
    name: "Alumni User",
    email: "alumni@example.com",
    role: "alumni",
    avatar: "https://i.pravatar.cc/150?img=3",
    connections: ["2", "4", "6"],
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for saved user on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem("alumniAppUser");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        // Simulate network delay
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user with matching email (demo only)
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      if (foundUser && password === "password") {
        setUser(foundUser);
        localStorage.setItem("alumniAppUser", JSON.stringify(foundUser));
        toast.success("Logged in successfully!");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("alumniAppUser");
    toast.info("Logged out successfully");
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
