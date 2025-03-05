
import React from "react";
import { Profile } from "@/contexts/DatabaseContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  MapPin, 
  Link as LinkIcon, 
  MessageSquare, 
  Edit, 
  UserPlus, 
  UserMinus 
} from "lucide-react";
import LazyImage from "../ui/LazyImage";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
  profile: Profile;
  isCurrentUser: boolean;
  isConnected: boolean;
  onEdit?: () => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMessage?: () => void;
  className?: string;
}

const ProfileHeader = ({
  profile,
  isCurrentUser,
  isConnected,
  onEdit,
  onConnect,
  onDisconnect,
  onMessage,
  className,
}: ProfileHeaderProps) => {
  const { user } = useAuth();
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className={cn("relative mb-6", className)}>
      {/* Cover Image */}
      <div className="h-48 md:h-64 w-full overflow-hidden rounded-xl relative bg-gradient-to-r from-primary/20 to-primary/30">
        {profile.coverImage ? (
          <LazyImage
            src={profile.coverImage}
            alt={`${profile.name}'s cover`}
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>

      {/* Profile Info */}
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 -mt-16 md:-mt-20 relative z-10">
          {/* Avatar */}
          <Avatar className="h-28 w-28 md:h-36 md:w-36 ring-4 ring-background">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback className="text-2xl">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>

          {/* User Info & Actions */}
          <div className="flex flex-1 flex-col md:flex-row md:items-end justify-between mt-2 md:mt-auto">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold">{profile.name}</h1>
                <Badge 
                  variant="outline" 
                  className="capitalize border-primary/20 text-primary-foreground bg-primary/10"
                >
                  {profile.role}
                </Badge>
              </div>
              {profile.headline && (
                <p className="text-muted-foreground">{profile.headline}</p>
              )}
              <div className="flex items-center gap-x-4 gap-y-2 flex-wrap">
                {profile.location && (
                  <span className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {profile.location}
                  </span>
                )}
                <span className="flex items-center text-sm text-muted-foreground">
                  <LinkIcon className="h-4 w-4 mr-1" />
                  {profile.connections?.length || 0} connection
                  {(profile.connections?.length || 0) !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex mt-4 md:mt-0 space-x-2">
              {isCurrentUser ? (
                <Button size="sm" variant="outline" onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  {user && user.role !== "admin" && (
                    <>
                      {isConnected ? (
                        <Button size="sm" variant="outline" onClick={onDisconnect}>
                          <UserMinus className="h-4 w-4 mr-2" />
                          Disconnect
                        </Button>
                      ) : (
                        <Button size="sm" onClick={onConnect}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={onMessage}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
