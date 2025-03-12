
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/contexts/AuthContext";
import { toast } from "sonner";

const DatabaseContext = createContext();

const mockProfiles = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    avatar: "https://i.pravatar.cc/150?img=1",
    headline: "Platform Administrator",
    bio: "Managing the alumni platform and connecting people.",
    location: "New York, NY",
    skills: ["Management", "Communication", "Leadership"],
  },
  {
    id: "2",
    name: "John Smith",
    email: "student@example.com",
    role: "student",
    avatar: "https://i.pravatar.cc/150?img=2",
    headline: "Computer Science Student",
    bio: "Learning and growing in the field of AI and machine learning.",
    education: [
      {
        id: "e1",
        institution: "Technical University",
        degree: "Bachelor's",
        field: "Computer Science",
        startDate: "2020-09-01",
        current: true,
      },
    ],
    skills: ["Python", "Machine Learning", "Java", "Web Development"],
    location: "Boston, MA",
    connections: ["3", "4", "5"],
  },
  {
    id: "3",
    name: "Sarah Johnson",
    email: "alumni@example.com",
    role: "alumni",
    avatar: "https://i.pravatar.cc/150?img=3",
    headline: "Senior Software Engineer at Google",
    bio: "Passionate about solving complex problems with elegant solutions.",
    education: [
      {
        id: "e2",
        institution: "Technical University",
        degree: "Master's",
        field: "Computer Science",
        startDate: "2014-09-01",
        endDate: "2016-06-30",
      },
      {
        id: "e3",
        institution: "Technical University",
        degree: "Bachelor's",
        field: "Computer Science",
        startDate: "2010-09-01",
        endDate: "2014-06-30",
      },
    ],
    experience: [
      {
        id: "ex1",
        company: "Google",
        title: "Senior Software Engineer",
        location: "Mountain View, CA",
        startDate: "2020-01-01",
        current: true,
        description: "Working on search algorithms and infrastructure.",
      },
      {
        id: "ex2",
        company: "Facebook",
        title: "Software Engineer",
        location: "Menlo Park, CA",
        startDate: "2016-07-15",
        endDate: "2019-12-31",
        description: "Developed social graph features and optimized performance.",
      },
    ],
    skills: ["JavaScript", "React", "Python", "Algorithms", "System Design"],
    location: "San Francisco, CA",
    connections: ["2", "4", "6"],
    coverImage: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000",
  },
  {
    id: "4",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    role: "alumni",
    avatar: "https://i.pravatar.cc/150?img=4",
    headline: "Product Manager at Amazon",
    bio: "Bridging the gap between technology and business needs.",
    education: [
      {
        id: "e4",
        institution: "Technical University",
        degree: "MBA",
        field: "Business Administration",
        startDate: "2015-09-01",
        endDate: "2017-06-30",
      },
      {
        id: "e5",
        institution: "Technical University",
        degree: "Bachelor's",
        field: "Computer Engineering",
        startDate: "2011-09-01",
        endDate: "2015-06-30",
      },
    ],
    experience: [
      {
        id: "ex3",
        company: "Amazon",
        title: "Product Manager",
        location: "Seattle, WA",
        startDate: "2019-03-01",
        current: true,
      },
      {
        id: "ex4",
        company: "Microsoft",
        title: "Associate Product Manager",
        location: "Redmond, WA",
        startDate: "2017-07-01",
        endDate: "2019-02-28",
      },
    ],
    skills: ["Product Management", "Agile", "User Research", "Data Analysis"],
    location: "Seattle, WA",
    connections: ["2", "3", "5"],
  },
  {
    id: "5",
    name: "Emily Garcia",
    email: "emily.garcia@example.com",
    role: "student",
    avatar: "https://i.pravatar.cc/150?img=5",
    headline: "Data Science Student",
    bio: "Exploring the world of data and statistical analysis.",
    education: [
      {
        id: "e6",
        institution: "Technical University",
        degree: "Bachelor's",
        field: "Data Science",
        startDate: "2021-09-01",
        current: true,
      },
    ],
    skills: ["Python", "R", "Statistics", "Machine Learning", "Data Visualization"],
    location: "Chicago, IL",
    connections: ["2", "4"],
  },
  {
    id: "6",
    name: "David Kim",
    email: "david.kim@example.com",
    role: "alumni",
    avatar: "https://i.pravatar.cc/150?img=8",
    headline: "UX Designer at Apple",
    bio: "Creating intuitive and beautiful user experiences.",
    education: [
      {
        id: "e7",
        institution: "Technical University",
        degree: "Bachelor's",
        field: "Design",
        startDate: "2012-09-01",
        endDate: "2016-06-30",
      },
    ],
    experience: [
      {
        id: "ex5",
        company: "Apple",
        title: "UX Designer",
        location: "Cupertino, CA",
        startDate: "2018-05-01",
        current: true,
      },
      {
        id: "ex6",
        company: "Adobe",
        title: "UI Designer",
        location: "San Jose, CA",
        startDate: "2016-07-15",
        endDate: "2018-04-30",
      },
    ],
    skills: ["UI/UX Design", "Figma", "Adobe XD", "Sketch", "Design Systems"],
    location: "San Francisco, CA",
    connections: ["3"],
  },
];

const mockEvents = [
  {
    id: "1",
    title: "Annual Alumni Reunion",
    description: "Join us for the annual alumni reunion event to reconnect with old friends and make new connections. The event will feature networking sessions, panel discussions, and a dinner gala.",
    date: "2024-06-15T18:00:00Z",
    location: "Grand University Hall",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1000",
    createdBy: "1",
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: "2",
    title: "Tech Industry Mixer",
    description: "A networking event focused on connecting current students with alumni working in the technology industry. This event will provide valuable insights into career paths and industry trends.",
    date: "2024-05-20T17:30:00Z",
    location: "Innovation Center",
    image: "https://images.unsplash.com/photo-1519683109079-d5f539a0a8bf?q=80&w=1000",
    createdBy: "1",
    createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
  },
  {
    id: "3",
    title: "Career Development Workshop",
    description: "A workshop focused on resume building, interview skills, and career planning. Alumni industry professionals will provide guidance and feedback.",
    date: "2024-04-12T15:00:00Z",
    location: "Career Services Center",
    createdBy: "1",
    createdAt: Date.now() - 21 * 24 * 60 * 60 * 1000,
  },
];

const mockMessages = [
  {
    id: "m1",
    senderId: "2",
    receiverId: "3",
    content: "Hi Sarah, I noticed you worked at Google. I'm interested in learning more about your experience there.",
    timestamp: Date.now() - 86400000 * 2,
    read: true,
  },
  {
    id: "m2",
    senderId: "3",
    receiverId: "2",
    content: "Hi John! I'd be happy to chat about my experience at Google. What specifically would you like to know?",
    timestamp: Date.now() - 86400000 * 1.5,
    read: true,
  },
  {
    id: "m3",
    senderId: "2",
    receiverId: "3",
    content: "I'm curious about the interview process and what skills I should focus on developing while still in school.",
    timestamp: Date.now() - 86400000,
    read: false,
  },
  {
    id: "m4",
    senderId: "4",
    receiverId: "3",
    content: "Hey Sarah, are you attending the alumni reunion next month?",
    timestamp: Date.now() - 86400000 * 3,
    read: true,
  },
  {
    id: "m5",
    senderId: "3",
    receiverId: "4",
    content: "Yes, I'm planning to be there! Looking forward to catching up.",
    timestamp: Date.now() - 86400000 * 2.8,
    read: true,
  },
];

const mockConversations = [
  {
    id: "c1",
    participants: ["2", "3"],
    lastMessageTimestamp: Date.now() - 86400000,
    unreadCount: 1,
  },
  {
    id: "c2",
    participants: ["3", "4"],
    lastMessageTimestamp: Date.now() - 86400000 * 2.8,
    unreadCount: 0,
  },
];

export const DatabaseProvider = ({ children }) => {
  const [profiles, setProfiles] = useState(mockProfiles);
  const [events, setEvents] = useState(mockEvents);
  const [messages, setMessages] = useState(mockMessages);
  const [conversations, setConversations] = useState(mockConversations);

  useEffect(() => {
    try {
      const storedProfiles = localStorage.getItem("alumniAppProfiles");
      const storedEvents = localStorage.getItem("alumniAppEvents");
      const storedMessages = localStorage.getItem("alumniAppMessages");
      const storedConversations = localStorage.getItem("alumniAppConversations");
      
      if (storedProfiles) setProfiles(JSON.parse(storedProfiles));
      if (storedEvents) setEvents(JSON.parse(storedEvents));
      if (storedMessages) setMessages(JSON.parse(storedMessages));
      if (storedConversations) setConversations(JSON.parse(storedConversations));
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("alumniAppProfiles", JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem("alumniAppEvents", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("alumniAppMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("alumniAppConversations", JSON.stringify(conversations));
  }, [conversations]);

  const getProfileById = (id) => {
    return profiles.find((profile) => profile.id === id);
  };

  const getProfilesByRole = (role) => {
    return profiles.filter((profile) => profile.role === role);
  };

  const updateProfile = (id, updatedProfile) => {
    setProfiles((prevProfiles) => {
      const updatedProfiles = prevProfiles.map((profile) => {
        if (profile.id === id) {
          return { ...profile, ...updatedProfile };
        }
        return profile;
      });
      return updatedProfiles;
    });
    toast.success("Profile updated successfully");
  };

  const addConnection = (userId, connectionId) => {
    setProfiles((prevProfiles) => {
      return prevProfiles.map((profile) => {
        if (profile.id === userId) {
          const connections = [...(profile.connections || [])];
          if (!connections.includes(connectionId)) {
            connections.push(connectionId);
          }
          return { ...profile, connections };
        }
        if (profile.id === connectionId) {
          const connections = [...(profile.connections || [])];
          if (!connections.includes(userId)) {
            connections.push(userId);
          }
          return { ...profile, connections };
        }
        return profile;
      });
    });
    toast.success("Connection added");
  };

  const removeConnection = (userId, connectionId) => {
    setProfiles((prevProfiles) => {
      return prevProfiles.map((profile) => {
        if (profile.id === userId) {
          const connections = (profile.connections || []).filter(
            (id) => id !== connectionId
          );
          return { ...profile, connections };
        }
        if (profile.id === connectionId) {
          const connections = (profile.connections || []).filter(
            (id) => id !== userId
          );
          return { ...profile, connections };
        }
        return profile;
      });
    });
    toast.success("Connection removed");
  };

  const sendMessage = (senderId, receiverId, content) => {
    const newMessage = {
      id: `m${Date.now()}`,
      senderId,
      receiverId,
      content,
      timestamp: Date.now(),
      read: false,
    };

    setMessages((prev) => [...prev, newMessage]);

    const participantIds = [senderId, receiverId].sort();
    const existingConversation = conversations.find(
      (c) => c.participants.includes(senderId) && c.participants.includes(receiverId)
    );

    if (existingConversation) {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === existingConversation.id) {
            return {
              ...conv,
              lastMessageTimestamp: newMessage.timestamp,
              unreadCount: conv.unreadCount + 1,
            };
          }
          return conv;
        })
      );
    } else {
      const newConversation = {
        id: `c${Date.now()}`,
        participants: participantIds,
        lastMessageTimestamp: newMessage.timestamp,
        unreadCount: 1,
      };
      setConversations((prev) => [...prev, newConversation]);
    }

    toast.success("Message sent");
  };

  const getMessagesBetweenUsers = (userId1, userId2) => {
    return messages.filter(
      (message) =>
        (message.senderId === userId1 && message.receiverId === userId2) ||
        (message.senderId === userId2 && message.receiverId === userId1)
    ).sort((a, b) => a.timestamp - b.timestamp);
  };

  const markMessagesAsRead = (senderId, receiverId) => {
    setMessages((prev) =>
      prev.map((message) => {
        if (message.senderId === senderId && message.receiverId === receiverId && !message.read) {
          return { ...message, read: true };
        }
        return message;
      })
    );

    const conversation = conversations.find(
      (c) => c.participants.includes(senderId) && c.participants.includes(receiverId)
    );

    if (conversation) {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === conversation.id) {
            return { ...conv, unreadCount: 0 };
          }
          return conv;
        })
      );
    }
  };

  const getUserConversations = (userId) => {
    return conversations
      .filter((conversation) => conversation.participants.includes(userId))
      .map((conversation) => {
        const otherUserId = conversation.participants.find((id) => id !== userId);
        const otherUser = profiles.find((profile) => profile.id === otherUserId);
        
        if (!otherUser) {
          throw new Error(`User with ID ${otherUserId} not found`);
        }
        
        return {
          ...conversation,
          otherUser,
        };
      })
      .sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
  };

  const addEvent = (event) => {
    const newEvent = {
      ...event,
      id: `e${Date.now()}`,
      createdAt: Date.now(),
    };
    setEvents((prev) => [...prev, newEvent]);
    toast.success("Event added successfully");
  };

  const updateEvent = (id, updatedEvent) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id === id) {
          return { ...event, ...updatedEvent };
        }
        return event;
      })
    );
    toast.success("Event updated successfully");
  };

  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
    toast.success("Event deleted successfully");
  };

  const value = {
    profiles,
    events,
    messages,
    conversations,
    getProfileById,
    getProfilesByRole,
    updateProfile,
    addConnection,
    removeConnection,
    sendMessage,
    getMessagesBetweenUsers,
    markMessagesAsRead,
    getUserConversations,
    addEvent,
    updateEvent,
    deleteEvent,
  };

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
};
