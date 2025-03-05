
import React, { useState } from "react";
import { Profile } from "@/contexts/DatabaseContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, XCircle, UserCircle, MapPin, Briefcase, GraduationCap } from "lucide-react";

interface ProfileEditProps {
  profile: Profile;
  onSave: (updatedProfile: Partial<Profile>) => void;
  onCancel: () => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Profile>>({
    ...profile,
  });

  // Education handlers
  const addEducation = () => {
    const newEducation = {
      id: `edu_${Date.now()}`,
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      current: false,
    };
    
    setFormData({
      ...formData,
      education: [...(formData.education || []), newEducation],
    });
  };

  const updateEducation = (index: number, field: string, value: string | boolean) => {
    if (!formData.education) return;
    
    const updatedEducation = [...formData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    
    setFormData({
      ...formData,
      education: updatedEducation,
    });
  };

  const removeEducation = (index: number) => {
    if (!formData.education) return;
    
    const updatedEducation = [...formData.education];
    updatedEducation.splice(index, 1);
    
    setFormData({
      ...formData,
      education: updatedEducation,
    });
  };

  // Experience handlers
  const addExperience = () => {
    const newExperience = {
      id: `exp_${Date.now()}`,
      company: "",
      title: "",
      location: "",
      startDate: "",
      current: false,
    };
    
    setFormData({
      ...formData,
      experience: [...(formData.experience || []), newExperience],
    });
  };

  const updateExperience = (index: number, field: string, value: string | boolean) => {
    if (!formData.experience) return;
    
    const updatedExperience = [...formData.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    };
    
    setFormData({
      ...formData,
      experience: updatedExperience,
    });
  };

  const removeExperience = (index: number) => {
    if (!formData.experience) return;
    
    const updatedExperience = [...formData.experience];
    updatedExperience.splice(index, 1);
    
    setFormData({
      ...formData,
      experience: updatedExperience,
    });
  };

  // Skills handlers
  const [newSkill, setNewSkill] = useState("");
  
  const addSkill = () => {
    if (!newSkill.trim()) return;
    
    setFormData({
      ...formData,
      skills: [...(formData.skills || []), newSkill.trim()],
    });
    
    setNewSkill("");
  };

  const removeSkill = (index: number) => {
    if (!formData.skills) return;
    
    const updatedSkills = [...formData.skills];
    updatedSkills.splice(index, 1);
    
    setFormData({
      ...formData,
      skills: updatedSkills,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium mb-1">Profile Picture</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Recommended size: 400x400px
                </p>
                <Button type="button" variant="outline" size="sm">
                  Upload Photo
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover">Cover Image URL</Label>
              <Input
                id="cover"
                value={formData.coverImage || ""}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://example.com/cover-image.jpg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  <UserCircle className="h-4 w-4 inline mr-1" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="headline">
                  <Briefcase className="h-4 w-4 inline mr-1" />
                  Headline
                </Label>
                <Input
                  id="headline"
                  value={formData.headline || ""}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="Your professional headline"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                <MapPin className="h-4 w-4 inline mr-1" />
                Location
              </Label>
              <Input
                id="location"
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, Country"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio || ""}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Write something about yourself"
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="experience">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="experience">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Work Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.experience?.map((exp, index) => (
                <div key={exp.id} className="p-4 border rounded-md relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => removeExperience(index)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor={`exp-title-${index}`}>Title</Label>
                      <Input
                        id={`exp-title-${index}`}
                        value={exp.title}
                        onChange={(e) => updateExperience(index, "title", e.target.value)}
                        placeholder="Job Title"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`exp-company-${index}`}>Company</Label>
                      <Input
                        id={`exp-company-${index}`}
                        value={exp.company}
                        onChange={(e) => updateExperience(index, "company", e.target.value)}
                        placeholder="Company Name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor={`exp-start-${index}`}>Start Date</Label>
                      <Input
                        id={`exp-start-${index}`}
                        type="date"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`exp-end-${index}`}>End Date</Label>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`exp-current-${index}`}
                            checked={exp.current}
                            onChange={(e) => updateExperience(index, "current", e.target.checked)}
                            className="mr-2"
                          />
                          <Label htmlFor={`exp-current-${index}`} className="text-sm">
                            Current
                          </Label>
                        </div>
                      </div>
                      <Input
                        id={`exp-end-${index}`}
                        type="date"
                        value={exp.endDate || ""}
                        onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                        disabled={exp.current}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <Label htmlFor={`exp-location-${index}`}>Location</Label>
                    <Input
                      id={`exp-location-${index}`}
                      value={exp.location || ""}
                      onChange={(e) => updateExperience(index, "location", e.target.value)}
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`exp-desc-${index}`}>Description</Label>
                    <Textarea
                      id={`exp-desc-${index}`}
                      value={exp.description || ""}
                      onChange={(e) => updateExperience(index, "description", e.target.value)}
                      placeholder="Brief description of your role and achievements"
                      rows={3}
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addExperience}
                className="w-full mt-2"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.education?.map((edu, index) => (
                <div key={edu.id} className="p-4 border rounded-md relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => removeEducation(index)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>

                  <div className="space-y-2 mb-4">
                    <Label htmlFor={`edu-institution-${index}`}>Institution</Label>
                    <Input
                      id={`edu-institution-${index}`}
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, "institution", e.target.value)}
                      placeholder="University or School Name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor={`edu-degree-${index}`}>Degree</Label>
                      <Input
                        id={`edu-degree-${index}`}
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, "degree", e.target.value)}
                        placeholder="Bachelor's, Master's, etc."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`edu-field-${index}`}>Field of Study</Label>
                      <Input
                        id={`edu-field-${index}`}
                        value={edu.field}
                        onChange={(e) => updateEducation(index, "field", e.target.value)}
                        placeholder="Computer Science, Business, etc."
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor={`edu-start-${index}`}>Start Date</Label>
                      <Input
                        id={`edu-start-${index}`}
                        type="date"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`edu-end-${index}`}>End Date</Label>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`edu-current-${index}`}
                            checked={edu.current}
                            onChange={(e) => updateEducation(index, "current", e.target.checked)}
                            className="mr-2"
                          />
                          <Label htmlFor={`edu-current-${index}`} className="text-sm">
                            Current
                          </Label>
                        </div>
                      </div>
                      <Input
                        id={`edu-end-${index}`}
                        type="date"
                        value={edu.endDate || ""}
                        onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                        disabled={edu.current}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`edu-desc-${index}`}>Description</Label>
                    <Textarea
                      id={`edu-desc-${index}`}
                      value={edu.description || ""}
                      onChange={(e) => updateEducation(index, "description", e.target.value)}
                      placeholder="Additional information about your studies"
                      rows={3}
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addEducation}
                className="w-full mt-2"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill (e.g., JavaScript, Project Management)"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill}>
                    Add
                  </Button>
                </div>

                {formData.skills && formData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {formData.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-muted px-3 py-1.5 rounded-full"
                      >
                        <span className="text-sm">{skill}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 ml-1"
                          onClick={() => removeSkill(index)}
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No skills added yet. Add skills that showcase your expertise.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CardFooter className="flex justify-between p-0">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </CardFooter>
    </form>
  );
};

export default ProfileEdit;
