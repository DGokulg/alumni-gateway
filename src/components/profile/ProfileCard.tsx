
import React from "react";
import { Link } from "react-router-dom";
import { Profile } from "@/contexts/DatabaseContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import LazyImage from "../ui/LazyImage";

interface ProfileCardProps {
  profile: Profile;
  isConnected?: boolean;
  onConnect?: () => void;
  className?: string;
}

const ProfileCard = ({
  profile,
  isConnected = false,
  onConnect,
  className,
}: ProfileCardProps) => {
  const { id, name, avatar, headline, location, role, skills } = profile;

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
      <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/40 relative">
        {profile.coverImage && (
          <LazyImage
            src={profile.coverImage}
            alt={`${name}'s cover`}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <CardContent className="pt-0 pb-3">
        <div className="flex justify-between -mt-10">
          <Avatar className="h-20 w-20 border-4 border-background">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-lg">{getInitials(name)}</AvatarFallback>
          </Avatar>
          <Badge
            variant="outline"
            className="mt-2 capitalize border-primary/20 text-primary-foreground bg-primary/10"
          >
            {role}
          </Badge>
        </div>
        <div className="mt-3 space-y-1.5">
          <Link to={`/profile/${id}`} className="hover:underline">
            <h3 className="font-semibold text-lg leading-none">{name}</h3>
          </Link>
          {headline && (
            <p className="text-sm text-muted-foreground line-clamp-2">{headline}</p>
          )}
          {location && (
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{location}</span>
            </div>
          )}
        </div>
        {skills && skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{skills.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-3 flex justify-between">
        <Link to={`/profile/${id}`}>
          <Button variant="ghost" size="sm" className="text-xs">
            View Profile
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </Link>
        {onConnect && (
          <Button
            size="sm"
            variant={isConnected ? "outline" : "default"}
            className="text-xs"
            onClick={onConnect}
          >
            {isConnected ? "Connected" : "Connect"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
