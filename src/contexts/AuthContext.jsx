
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useDatabase } from "./DatabaseContext";

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
        throw new Error(data.msg || 'Login failed');
      }

      const data = await response.json();
      const userData = {
        ...data.user,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        connections: [],
      };

      setUser(userData);
      localStorage.setItem("alumniAppUser", JSON.stringify(userData));
      toast.success("Logged in successfully!");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password, role) => {
    setIsLoading(true);
    
    try {
      // Register user with backend
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || 'Registration failed');
      }

      const data = await response.json();
      
      // Generate a random ID if the backend doesn't provide one
      const userId = data.user?.id || `user_${Date.now()}`;
      
      // Create a default profile in the database
      const defaultProfile = {
        id: userId,
        name,
        email,
        role,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        connections: [],
        headline: `${role === 'student' ? 'Student' : 'Alumni'} at Technical University`,
        bio: `I am a ${role} at Technical University.`,
        skills: [],
        location: '',
      };
      
      // Update the profile in the database
      updateProfile(userId, defaultProfile);
      
      toast.success("Registration successful! Please log in.");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
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
