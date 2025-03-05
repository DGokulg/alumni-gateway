
import React, { useState } from "react";
import { useDatabase, UserRole } from "@/contexts/DatabaseContext";
import Layout from "@/components/layout/Layout";
import PageContainer from "@/components/layout/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { 
  Users, 
  Calendar, 
  Search, 
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  UserCog,
  PlusCircle
} from "lucide-react";
import { format, parseISO } from "date-fns";

const AdminDashboard = () => {
  const { profiles, events, getProfilesByRole } = useDatabase();
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [alumniSearchQuery, setAlumniSearchQuery] = useState("");
  const [eventSearchQuery, setEventSearchQuery] = useState("");
  
  // Get students and alumni
  const students = getProfilesByRole("student");
  const alumni = getProfilesByRole("alumni");
  
  // Filter students by search
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(studentSearchQuery.toLowerCase())
  );
  
  // Filter alumni by search
  const filteredAlumni = alumni.filter(alumnus => 
    alumnus.name.toLowerCase().includes(alumniSearchQuery.toLowerCase()) ||
    alumnus.email.toLowerCase().includes(alumniSearchQuery.toLowerCase())
  );
  
  // Filter events by search
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(eventSearchQuery.toLowerCase())
  );
  
  // Format date
  const formatEventDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "PPP");
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
      <PageContainer>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold flex items-center">
              <UserCog className="mr-2 h-7 w-7" />
              Admin Dashboard
            </h1>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Overview</CardTitle>
              <CardDescription>
                Manage students, alumni, and events from this dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Students
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{students.length}</div>
                    <p className="text-sm text-muted-foreground">Registered students</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Alumni
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{alumni.length}</div>
                    <p className="text-sm text-muted-foreground">Registered alumni</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{events.length}</div>
                    <p className="text-sm text-muted-foreground">Total events</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="students">
            <TabsList className="mb-6">
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="alumni">Alumni</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
            
            <TabsContent value="students">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <CardTitle className="text-lg">Students</CardTitle>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search students..."
                        className="pl-10"
                        value={studentSearchQuery}
                        onChange={(e) => setStudentSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="p-4 divide-y">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <div key={student.id} className="py-4 first:pt-0 last:pb-0">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarImage src={student.avatar} alt={student.name} />
                                <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium">{student.name}</p>
                                  <Link to={`/profile/${student.id}`}>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <ExternalLink className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                </div>
                                <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-muted-foreground">
                                  <span className="flex items-center">
                                    <Mail className="mr-1 h-3 w-3" />
                                    {student.email}
                                  </span>
                                  {student.location && (
                                    <span className="flex items-center">
                                      <MapPin className="mr-1 h-3 w-3" />
                                      {student.location}
                                    </span>
                                  )}
                                </div>
                                {student.education && student.education.length > 0 && (
                                  <p className="text-xs">
                                    {student.education[0].degree} in {student.education[0].field} at{" "}
                                    {student.education[0].institution}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-4 text-center text-muted-foreground">
                          No students found
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="alumni">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <CardTitle className="text-lg">Alumni</CardTitle>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search alumni..."
                        className="pl-10"
                        value={alumniSearchQuery}
                        onChange={(e) => setAlumniSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="p-4 divide-y">
                      {filteredAlumni.length > 0 ? (
                        filteredAlumni.map((alumnus) => (
                          <div key={alumnus.id} className="py-4 first:pt-0 last:pb-0">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarImage src={alumnus.avatar} alt={alumnus.name} />
                                <AvatarFallback>{getInitials(alumnus.name)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium">{alumnus.name}</p>
                                  <Link to={`/profile/${alumnus.id}`}>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <ExternalLink className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                </div>
                                <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-muted-foreground">
                                  <span className="flex items-center">
                                    <Mail className="mr-1 h-3 w-3" />
                                    {alumnus.email}
                                  </span>
                                  {alumnus.location && (
                                    <span className="flex items-center">
                                      <MapPin className="mr-1 h-3 w-3" />
                                      {alumnus.location}
                                    </span>
                                  )}
                                </div>
                                {alumnus.experience && alumnus.experience.length > 0 && (
                                  <p className="text-xs">
                                    {alumnus.experience[0].title} at {alumnus.experience[0].company}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-4 text-center text-muted-foreground">
                          No alumni found
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="events">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <CardTitle className="text-lg">Events</CardTitle>
                    <div className="flex gap-4">
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search events..."
                          className="pl-10"
                          value={eventSearchQuery}
                          onChange={(e) => setEventSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button asChild>
                        <Link to="/events">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          New Event
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="p-4 divide-y">
                      {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                          <div key={event.id} className="py-4 first:pt-0 last:pb-0">
                            <div className="flex items-start gap-4">
                              <div className="flex-none bg-muted rounded-md w-14 h-14 flex flex-col items-center justify-center">
                                <span className="text-xs font-medium">
                                  {formatEventDate(event.date).split(" ")[0]}
                                </span>
                                <span className="text-sm font-bold">
                                  {formatEventDate(event.date).split(" ")[1]}
                                </span>
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium">{event.title}</p>
                                  <Link to={`/events`}>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <ExternalLink className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {event.description}
                                </p>
                                <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-muted-foreground">
                                  <span className="flex items-center">
                                    <MapPin className="mr-1 h-3 w-3" />
                                    {event.location}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-4 text-center text-muted-foreground">
                          No events found
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default AdminDashboard;
