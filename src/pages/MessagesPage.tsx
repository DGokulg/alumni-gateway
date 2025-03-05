
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDatabase, Message } from "@/contexts/DatabaseContext";
import Layout from "@/components/layout/Layout";
import PageContainer from "@/components/layout/PageContainer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Send, MessageSquare, Search } from "lucide-react";

const MessagesPage = () => {
  const { user } = useAuth();
  const { 
    getUserConversations, 
    getMessagesBetweenUsers, 
    sendMessage, 
    markMessagesAsRead, 
    getProfileById 
  } = useDatabase();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialUserId = searchParams.get("userId");
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(initialUserId);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get conversations and messages
  const conversations = user ? getUserConversations(user.id) : [];
  const messages = selectedUserId && user ? getMessagesBetweenUsers(user.id, selectedUserId) : [];
  const selectedProfile = selectedUserId ? getProfileById(selectedUserId) : null;
  
  // Filter conversations by search query
  const filteredConversations = conversations.filter(conv => 
    conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Mark messages as read when selecting a conversation
  useEffect(() => {
    if (selectedUserId && user) {
      markMessagesAsRead(selectedUserId, user.id);
    }
  }, [selectedUserId, user, markMessagesAsRead]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Set userId from URL param if available
  useEffect(() => {
    if (initialUserId) {
      setSelectedUserId(initialUserId);
      navigate("/messages", { replace: true });
    }
  }, [initialUserId, navigate]);
  
  // Handle send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user || !selectedUserId) return;
    
    sendMessage(user.id, selectedUserId, message);
    setMessage("");
  };
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };
  
  // Format timestamp
  const formatTime = (timestamp: number) => {
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };

  return (
    <Layout>
      <PageContainer className="max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-13rem)]">
          {/* Conversations List */}
          <Card className="md:col-span-1 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Messages
              </h2>
              <div className="mt-2 relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                <div className="divide-y">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 hover:bg-accent/30 cursor-pointer transition-colors ${
                        selectedUserId === conversation.otherUser.id ? "bg-accent/20" : ""
                      }`}
                      onClick={() => setSelectedUserId(conversation.otherUser.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.otherUser.avatar} alt={conversation.otherUser.name} />
                          <AvatarFallback>{getInitials(conversation.otherUser.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">{conversation.otherUser.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(conversation.lastMessageTimestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.otherUser.headline || conversation.otherUser.role}
                          </p>
                        </div>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <Badge className="mt-1 ml-11" variant="default">
                          {conversation.unreadCount} new
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No conversations found</p>
                </div>
              )}
            </div>
          </Card>
          
          {/* Messages Area */}
          <Card className="md:col-span-2 flex flex-col h-full overflow-hidden">
            {selectedUserId && selectedProfile ? (
              <>
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedProfile.avatar} alt={selectedProfile.name} />
                      <AvatarFallback>{getInitials(selectedProfile.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedProfile.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedProfile.headline || selectedProfile.role}
                      </p>
                    </div>
                  </div>
                </div>
                
                <CardContent className="flex-1 overflow-y-auto p-4">
                  {messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message: Message) => {
                        const isCurrentUser = user && message.senderId === user.id;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[75%] rounded-lg p-3 ${
                                isCurrentUser
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <span className="text-xs opacity-70 block text-right mt-1">
                                {formatTime(message.timestamp)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                    </div>
                  )}
                </CardContent>
                
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!message.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-6">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
                  <p className="text-muted-foreground">
                    Select a conversation to view messages or start a new conversation from a user's profile
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default MessagesPage;
