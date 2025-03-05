
import React from "react";
import { Profile } from "@/contexts/DatabaseContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, UserCheck, UserPlus, MessageSquare, MapPin } from "lucide-react";

interface ProfileHeaderProps {
  profile: Profile;
  isCurrentUser: boolean;
  isConnected: boolean;
  onEdit: () => void;
  onConnect: () => void;
  onDisconnect: () => void;
  onMessage: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  isCurrentUser,
  isConnected,
  onEdit,
  onConnect,
  onDisconnect,
  onMessage,
}) => {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="w-full bg-accent/50">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Cover Image */}
          <div className="h-48 md:h-64 w-full overflow-hidden bg-gradient-to-r from-primary/20 to-primary/40">
            {profile.coverImage && (
              <img
                src={profile.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          {/* Profile Info */}
          <div className="relative px-4 pb-4 -mt-16">
            <div className="flex flex-col md:flex-row gap-4 md:items-end">
              {/* Avatar */}
              <Avatar className="h-32 w-32 ring-4 ring-background relative z-10">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="text-3xl">{getInitials(profile.name)}</AvatarFallback>
              </Avatar>
              
              {/* Profile Actions */}
              <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0 justify-between flex-1">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold">{profile.name}</h1>
                    <div className="bg-primary/10 text-primary-foreground rounded px-2 py-1 h-fit text-xs uppercase font-medium">
                      {profile.role}
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-1">{profile.headline}</p>
                  {profile.location && (
                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {profile.location}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mt-4 md:mt-0 md:self-end">
                  {isCurrentUser ? (
                    <Button onClick={onEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      {isConnected ? (
                        <Button variant="outline" onClick={onDisconnect}>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Connected
                        </Button>
                      ) : (
                        <Button onClick={onConnect}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      )}
                      <Button variant="secondary" onClick={onMessage}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
