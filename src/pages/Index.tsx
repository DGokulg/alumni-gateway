
import React from "react";
import { Link } from "react-router-dom";
import { useDatabase } from "@/contexts/DatabaseContext";
import Layout from "@/components/layout/Layout";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LazyImage from "@/components/ui/LazyImage";
import { 
  Calendar, 
  MapPin, 
  Users, 
  BarChart, 
  UserCircle, 
  MessageSquare, 
  ArrowRight,
  BookOpen
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, parseISO } from "date-fns";

const Index = () => {
  const { events, profiles } = useDatabase();
  
  // Get upcoming events (sort by date, most recent first)
  const upcomingEvents = [...events]
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  
  // Get featured profiles (random selection of 3 profiles with skills)
  const featuredProfiles = [...profiles]
    .filter(profile => profile.skills && profile.skills.length > 0)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
  
  // Format date for display
  const formatEventDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "PPP 'at' p");
    } catch (error) {
      return dateString;
    }
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-b from-primary/10 to-background">
        <PageContainer className="py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Connect with your Alumni Network
              </h1>
              <p className="text-xl text-muted-foreground">
                Build meaningful connections, find career opportunities, and stay updated with alumni events.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link to="/profiles">
                    <Users className="mr-2 h-5 w-5" />
                    Explore Profiles
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/events">
                    <Calendar className="mr-2 h-5 w-5" />
                    View Events
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative aspect-video overflow-hidden rounded-xl shadow-xl">
                <LazyImage
                  src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1000"
                  alt="Alumni gathering"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-background p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/20 rounded-full p-2">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Join the Community</p>
                    <p className="text-muted-foreground">{profiles.length} members</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
      
      {/* Features Section */}
      <PageContainer className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">What You Can Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-br from-background to-muted/50">
            <CardHeader>
              <div className="bg-primary/20 rounded-full p-3 w-fit mb-4">
                <UserCircle className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Professional Profiles</CardTitle>
              <CardDescription>Create and maintain your professional profile to showcase your achievements.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="link" className="px-0" asChild>
                <Link to="/profiles">
                  Browse Profiles <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-gradient-to-br from-background to-muted/50">
            <CardHeader>
              <div className="bg-primary/20 rounded-full p-3 w-fit mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Private Messaging</CardTitle>
              <CardDescription>Connect directly with fellow alumni and students through our messaging platform.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="link" className="px-0" asChild>
                <Link to="/messages">
                  Start Messaging <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-gradient-to-br from-background to-muted/50">
            <CardHeader>
              <div className="bg-primary/20 rounded-full p-3 w-fit mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Networking Events</CardTitle>
              <CardDescription>Discover and attend virtual and in-person events exclusive to our community.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="link" className="px-0" asChild>
                <Link to="/events">
                  View Events <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </PageContainer>
      
      {/* Upcoming Events Section */}
      <div className="bg-muted/30">
        <PageContainer className="py-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Button variant="outline" asChild>
              <Link to="/events">
                View All Events <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  {event.image && (
                    <div className="h-48 overflow-hidden">
                      <LazyImage
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className={event.image ? "pt-4" : ""}>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatEventDate(event.date)}
                    </CardDescription>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {event.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {event.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/events">View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center p-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Upcoming Events</h3>
                <p className="text-muted-foreground">Check back soon for new events!</p>
              </div>
            )}
          </div>
        </PageContainer>
      </div>
      
      {/* Featured Profiles Section */}
      <PageContainer className="py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Featured Profiles</h2>
          <Button variant="outline" asChild>
            <Link to="/profiles">
              View All Profiles <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProfiles.map((profile) => (
            <Card key={profile.id} className="relative overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/40">
                {profile.coverImage && (
                  <LazyImage
                    src={profile.coverImage}
                    alt={`${profile.name}'s cover`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <CardContent className="pt-0 pb-4">
                <div className="flex justify-between -mt-10 mb-4">
                  <Avatar className="h-20 w-20 ring-4 ring-background">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback className="text-lg">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-primary/10 text-primary-foreground rounded px-2 py-1 h-fit mt-2 text-xs uppercase font-medium">
                    {profile.role}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {profile.headline || (profile.role === "student" ? "Student" : "Alumni")}
                  </p>
                  
                  {profile.skills && profile.skills.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-medium mb-2">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {profile.skills.slice(0, 4).map((skill) => (
                          <span 
                            key={skill} 
                            className="bg-muted px-2 py-1 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {profile.skills.length > 4 && (
                          <span className="bg-muted px-2 py-1 rounded-full text-xs">
                            +{profile.skills.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to={`/profile/${profile.id}`}>View Profile</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </PageContainer>
      
      {/* Call to Action */}
      <div className="bg-primary/10">
        <PageContainer className="py-16">
          <div className="flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
            <BookOpen className="h-12 w-12 text-primary" />
            <h2 className="text-3xl font-bold">Join Our Alumni Community Today</h2>
            <p className="text-lg text-muted-foreground">
              Connect with former classmates, expand your professional network, and discover new opportunities through our platform.
            </p>
            <Button size="lg" asChild>
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
        </PageContainer>
      </div>
    </Layout>
  );
};

export default Index;
