
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useDatabase } from "./DatabaseContext";

export const UserRole = {
  STUDENT: "student",
  ALUMNI: "alumni",
  ADMIN: "admin"
};

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { profiles, updateProfile } = useDatabase();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }

      const data = await response.json();
      const userData = {
        ...data.user,
        avatar: data.user.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      };

      setUser(userData);
      localStorage.setItem("alumniAppUser", JSON.stringify(userData));
      toast.success("Logged in successfully!");
      return userData;
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Registration failed');
      }

      const data = await response.json();
      toast.success("Registration successful! Please log in.");
      return data;
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.");
      console.error("Registration error:", error);
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
    register,
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
