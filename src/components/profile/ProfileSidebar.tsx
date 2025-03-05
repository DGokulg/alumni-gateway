
import React from "react";
import { Profile } from "@/contexts/DatabaseContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";

interface ProfileSidebarProps {
  profile: Profile;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ profile }) => {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  // Calculate connections count
  const connectionsCount = profile.connections?.length || 0;

  return (
    <div className="space-y-6">
      {/* Connections */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Connections
          </CardTitle>
        </CardHeader>
        <CardContent>
          {connectionsCount > 0 ? (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground mb-2">
                {connectionsCount} connection{connectionsCount !== 1 ? "s" : ""}
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.connections?.map((connectionId) => (
                  <Link
                    key={connectionId}
                    to={`/profile/${connectionId}`}
                    className="flex-shrink-0"
                  >
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={`https://i.pravatar.cc/150?img=${connectionId}`} />
                      <AvatarFallback>
                        {getInitials(`User ${connectionId}`)}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No connections yet.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommended People */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">People you may know</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((id) => (
              <Link
                key={id}
                to={`/profile/${id + 10}`}
                className="flex items-center gap-3 hover:bg-accent p-2 rounded-md -mx-2"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://i.pravatar.cc/150?img=${id + 10}`} />
                  <AvatarFallback>
                    {getInitials(`User ${id + 10}`)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Recommended User {id}</p>
                  <p className="text-xs text-muted-foreground">Connection suggestion</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSidebar;
