
import React, { useState } from "react";
import { useDatabase } from "@/contexts/DatabaseContext";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import PageContainer from "@/components/layout/PageContainer";
import ProfileCard from "@/components/profile/ProfileCard";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { UserRole } from "@/contexts/AuthContext";
import { Search, Users } from "lucide-react";

const ProfilesListPage = () => {
  const { profiles, addConnection, removeConnection } = useDatabase();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Filter profiles based on search and role
  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch = 
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (profile.headline && profile.headline.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (profile.bio && profile.bio.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesRole = roleFilter === "all" || profile.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });
  
  // Handle connect/disconnect
  const handleConnectionToggle = (profileId: string) => {
    if (!user) return;
    
    const isConnected = user.connections?.includes(profileId);
    
    if (isConnected) {
      removeConnection(user.id, profileId);
    } else {
      addConnection(user.id, profileId);
    }
  };

  return (
    <Layout>
      <PageContainer>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold flex items-center">
              <Users className="mr-2 h-7 w-7" />
              Browse Profiles
            </h1>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-1">
              <label htmlFor="search" className="text-sm font-medium">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, headline, or bio..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-48 space-y-1">
              <label htmlFor="role-filter" className="text-sm font-medium">
                Filter by role
              </label>
              <Select 
                value={roleFilter} 
                onValueChange={setRoleFilter}
              >
                <SelectTrigger id="role-filter">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="alumni">Alumni</SelectItem>
                  <SelectItem value="admin">Administrators</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                isConnected={user?.connections?.includes(profile.id)}
                onConnect={() => handleConnectionToggle(profile.id)}
              />
            ))}
            
            {filteredProfiles.length === 0 && (
              <div className="col-span-full p-10 text-center">
                <p className="text-muted-foreground">No profiles match your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default ProfilesListPage;
