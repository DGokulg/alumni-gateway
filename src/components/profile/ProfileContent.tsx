
import React from "react";
import { Profile, Education, Experience } from "@/contexts/DatabaseContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Briefcase, 
  Calendar, 
  MapPin,
  Award
} from "lucide-react";
import { format } from "date-fns";

interface ProfileContentProps {
  profile: Profile;
}

const ProfileContent = ({ profile }: ProfileContentProps) => {
  return (
    <div className="space-y-6">
      {/* About Section */}
      {profile.bio && (
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{profile.bio}</p>
          </CardContent>
        </Card>
      )}

      {/* Experience Section */}
      {profile.experience && profile.experience.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.experience.map((exp, index) => (
              <div key={exp.id}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-1 flex-1">
                    <h4 className="font-medium">{exp.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {exp.company}
                      {exp.location && (
                        <span className="flex items-center text-xs mt-0.5">
                          <MapPin className="h-3 w-3 mr-1" />
                          {exp.location}
                        </span>
                      )}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <time>
                        {format(new Date(exp.startDate), "MMM yyyy")} -{" "}
                        {exp.current
                          ? "Present"
                          : exp.endDate && format(new Date(exp.endDate), "MMM yyyy")}
                      </time>
                    </div>
                    {exp.description && (
                      <p className="text-sm mt-2">{exp.description}</p>
                    )}
                  </div>
                </div>
                {index < profile.experience.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Education Section */}
      {profile.education && profile.education.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.education.map((edu, index) => (
              <div key={edu.id}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-1 flex-1">
                    <h4 className="font-medium">{edu.institution}</h4>
                    <p className="text-sm text-muted-foreground">
                      {edu.degree} in {edu.field}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <time>
                        {format(new Date(edu.startDate), "MMM yyyy")} -{" "}
                        {edu.current
                          ? "Present"
                          : edu.endDate && format(new Date(edu.endDate), "MMM yyyy")}
                      </time>
                    </div>
                    {edu.description && (
                      <p className="text-sm mt-2">{edu.description}</p>
                    )}
                  </div>
                </div>
                {index < profile.education.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Skills Section */}
      {profile.skills && profile.skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill} className="bg-primary/10 hover:bg-primary/20 text-primary-foreground">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileContent;
