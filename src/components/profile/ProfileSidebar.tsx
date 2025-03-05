
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDatabase, Profile } from "@/contexts/DatabaseContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserPlus, UserMinus } from "lucide-react";

interface ProfileSidebarProps {
  profile: Profile;
}

const ProfileSidebar = ({ profile }: ProfileSidebarProps) => {
  const { user } = useAuth();
  const { getProfileById, addConnection, removeConnection } = useDatabase();
  
  // Get connected profiles
  const connections = profile.connections?.map(id => getProfileById(id)).filter(Boolean) as Profile[];
  
  // Check if current user is connected to this profile
  const isCurrentUserConnected = 
    user && 
    profile.connections?.includes(user.id);

  const handleConnect = () => {
    if (!user) return;
    addConnection(user.id, profile.id);
  };

  const handleDisconnect = () => {
    if (!user) return;
    removeConnection(user.id, profile.id);
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
    <div className="space-y-6">
      {/* Connections section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Connections</CardTitle>
        </CardHeader>
        <CardContent>
          {connections && connections.length > 0 ? (
            <div className="space-y-4">
              {connections.slice(0, 5).map((connection) => (
                <div key={connection.id} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={connection.avatar} alt={connection.name} />
                    <AvatarFallback>{getInitials(connection.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/profile/${connection.id}`} 
                      className="text-sm font-medium hover:underline block truncate"
                    >
                      {connection.name}
                    </Link>
                    <p className="text-xs text-muted-foreground truncate">
                      {connection.headline || connection.role}
                    </p>
                  </div>
                </div>
              ))}
              
              {connections.length > 5 && (
                <>
                  <Separator />
                  <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
                    <Link to={`/connections/${profile.id}`}>
                      View all {connections.length} connections
                    </Link>
                  </Button>
                </>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No connections yet</p>
          )}
          
          {user && user.id !== profile.id && user.role !== "admin" && (
            <div className="mt-4">
              {isCurrentUserConnected ? (
                <Button variant="outline" size="sm" className="w-full" onClick={handleDisconnect}>
                  <UserMinus className="h-4 w-4 mr-2" />
                  Remove Connection
                </Button>
              ) : (
                <Button size="sm" className="w-full" onClick={handleConnect}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Connect
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSidebar;
