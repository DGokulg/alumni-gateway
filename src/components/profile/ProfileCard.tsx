
import React from "react";
import { Link } from "react-router-dom";
import { Profile } from "@/contexts/DatabaseContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { UserCheck, UserPlus } from "lucide-react";

interface ProfileCardProps {
  profile: Profile;
  isConnected?: boolean;
  onConnect?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, isConnected, onConnect }) => {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/40">
        {profile.coverImage && (
          <img
            src={profile.coverImage}
            alt={`${profile.name}'s cover`}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <CardContent className="pt-0 pb-4 flex-1">
        <div className="flex justify-between -mt-10 mb-4">
          <Avatar className="h-20 w-20 ring-4 ring-background">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback className="text-lg">{getInitials(profile.name)}</AvatarFallback>
          </Avatar>
          <div className="bg-primary/10 text-primary-foreground rounded px-2 py-1 h-fit mt-2 text-xs uppercase font-medium">
            {profile.role}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-lg">{profile.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {profile.headline || (profile.role === "student" ? "Student" : "Alumni")}
          </p>
          
          {profile.location && (
            <p className="text-xs text-muted-foreground mt-2">{profile.location}</p>
          )}
          
          {profile.skills && profile.skills.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium mb-2">Skills</p>
              <div className="flex flex-wrap gap-1">
                {profile.skills.slice(0, 3).map((skill) => (
                  <span 
                    key={skill} 
                    className="bg-muted px-2 py-1 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
                {profile.skills.length > 3 && (
                  <span className="bg-muted px-2 py-1 rounded-full text-xs">
                    +{profile.skills.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 border-t pt-4">
        <Button variant="outline" className="flex-1" asChild>
          <Link to={`/profile/${profile.id}`}>View Profile</Link>
        </Button>
        {onConnect && (
          <Button 
            variant={isConnected ? "secondary" : "default"} 
            size="icon" 
            onClick={onConnect}
            title={isConnected ? "Disconnect" : "Connect"}
          >
            {isConnected ? (
              <UserCheck className="h-4 w-4" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
