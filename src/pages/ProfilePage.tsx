
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDatabase } from "@/contexts/DatabaseContext";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import PageContainer from "@/components/layout/PageContainer";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileContent from "@/components/profile/ProfileContent";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileEdit from "@/components/profile/ProfileEdit";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getProfileById, updateProfile, addConnection, removeConnection } = useDatabase();
  const [isEditing, setIsEditing] = useState(false);

  // Get profile data
  const profile = id ? getProfileById(id) : null;
  
  // Current user viewing own profile
  const isCurrentUser = user?.id === id;
  
  // Check if user is connected to profile
  const isConnected = user && profile?.connections?.includes(user.id);
  
  // Handle edit profile
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  // Handle save profile
  const handleSave = (updatedProfile: any) => {
    if (id) {
      updateProfile(id, updatedProfile);
      setIsEditing(false);
    }
  };
  
  // Handle cancel edit
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  // Handle connect with user
  const handleConnect = () => {
    if (user && id) {
      addConnection(user.id, id);
    }
  };
  
  // Handle disconnect from user
  const handleDisconnect = () => {
    if (user && id) {
      removeConnection(user.id, id);
    }
  };
  
  // Handle send message
  const handleMessage = () => {
    if (id) {
      navigate(`/messages?userId=${id}`);
    }
  };

  if (!id) {
    return (
      <Layout>
        <PageContainer>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Profile ID is missing. Please try again.
            </AlertDescription>
          </Alert>
        </PageContainer>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <PageContainer>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not Found</AlertTitle>
            <AlertDescription>
              The profile you're looking for doesn't exist or has been removed.
            </AlertDescription>
          </Alert>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      {isEditing ? (
        <PageContainer>
          <ProfileEdit 
            profile={profile} 
            onSave={handleSave} 
            onCancel={handleCancel} 
          />
        </PageContainer>
      ) : (
        <>
          <ProfileHeader 
            profile={profile}
            isCurrentUser={isCurrentUser}
            isConnected={!!isConnected}
            onEdit={handleEdit}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onMessage={handleMessage}
          />
          <PageContainer className="mt-0 pt-0">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 order-2 md:order-1">
                <ProfileContent profile={profile} />
              </div>
              <div className="w-full md:w-80 order-1 md:order-2">
                <ProfileSidebar profile={profile} />
              </div>
            </div>
          </PageContainer>
        </>
      )}
    </Layout>
  );
};

export default ProfilePage;
