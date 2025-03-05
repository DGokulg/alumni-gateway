
import React from "react";
import { Profile } from "@/contexts/DatabaseContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, Calendar } from "lucide-react";

interface ProfileContentProps {
  profile: Profile;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ profile }) => {
  // Format date helper (YYYY-MM-DD)
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    try {
      return format(parseISO(dateString), "MMM yyyy");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Bio */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{profile.bio || "No bio provided."}</p>
        </CardContent>
      </Card>

      {/* Experience, Education, Skills */}
      <Tabs defaultValue="experience">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>
        
        <TabsContent value="experience" className="pt-2">
          <Card>
            <CardContent className="pt-6">
              {profile.experience && profile.experience.length > 0 ? (
                <div className="space-y-6">
                  {profile.experience.map((exp) => (
                    <div key={exp.id} className="relative pl-8 pb-4 border-b last:border-0 last:pb-0">
                      <div className="absolute left-0 top-0">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10">
                          <Briefcase className="h-3 w-3 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold">{exp.title}</h3>
                        <p className="text-sm">{exp.company}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(exp.startDate)} — {exp.current ? "Present" : formatDate(exp.endDate)}
                        </div>
                        {exp.location && (
                          <p className="text-xs text-muted-foreground mt-1">{exp.location}</p>
                        )}
                        {exp.description && (
                          <p className="text-sm mt-2">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No experience added yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="education" className="pt-2">
          <Card>
            <CardContent className="pt-6">
              {profile.education && profile.education.length > 0 ? (
                <div className="space-y-6">
                  {profile.education.map((edu) => (
                    <div key={edu.id} className="relative pl-8 pb-4 border-b last:border-0 last:pb-0">
                      <div className="absolute left-0 top-0">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10">
                          <GraduationCap className="h-3 w-3 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold">{edu.institution}</h3>
                        <p className="text-sm">
                          {edu.degree} in {edu.field}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(edu.startDate)} — {edu.current ? "Present" : formatDate(edu.endDate)}
                        </div>
                        {edu.description && (
                          <p className="text-sm mt-2">{edu.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No education added yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="skills" className="pt-2">
          <Card>
            <CardContent className="pt-6">
              {profile.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No skills added yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileContent;
