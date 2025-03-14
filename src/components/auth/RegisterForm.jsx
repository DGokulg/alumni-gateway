
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserRole } from "@/contexts/AuthContext";

const baseSchema = {
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
};

const programOptions = [
  "Artificial Intelligence & Data Science",
  "Computer Science and Business Systems",
  "Biomedical Engineering",
  "Civil Engineering",
  "Computer Science and Engineering",
  "Electrical and Electronics Engineering",
  "Electronics and Communications Engineering",
  "Mechanical Engineering",
  "Information Technology",
  "Cyber Security",
  "Master of Business Administration(MBA)"
];

const industryOptions = [
  "Information Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Telecommunications",
  "Government",
  "Consulting",
  "Entertainment",
  "Automotive",
  "Energy",
  "Aerospace",
  "Hospitality",
  "Other"
];

const commonFields = {
  name: z.string().min(2, "Name is required"),
  program: z.string().min(1, "Program is required"),
  email: baseSchema.email,
  password: baseSchema.password,
  confirmPassword: baseSchema.confirmPassword,
};

const alumniSchema = z.object({
  ...commonFields,
  role: z.literal(UserRole.ALUMNI),
  phoneNumber: z.string().optional(),
  graduationYear: z.string().min(1, "Graduation year is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  companyName: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
  workExperience: z.string().min(1, "Work experience is required"),
  location: z.string().min(1, "Location is required"),
  linkedinProfile: z.string().url("Invalid URL").optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const studentSchema = z.object({
  ...commonFields,
  role: z.literal(UserRole.STUDENT),
  registrationNumber: z.string().min(1, "Registration number is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const RegisterForm = ({ onSuccess }) => {
  const { register } = useAuth();
  const [role, setRole] = useState(UserRole.STUDENT);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Generate graduation year options
  const currentYear = new Date().getFullYear();
  const graduationYears = [];
  for (let year = 2011; year <= currentYear; year++) {
    graduationYears.push(year.toString());
  }

  const alumniForm = useForm({
    resolver: zodResolver(alumniSchema),
    defaultValues: {
      role: UserRole.ALUMNI,
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      graduationYear: "",
      program: "",
      jobTitle: "",
      companyName: "",
      industry: "",
      workExperience: "",
      location: "",
      linkedinProfile: "",
    },
  });

  const studentForm = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      role: UserRole.STUDENT,
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      registrationNumber: "",
      program: "",
    },
  });

  const handleRoleChange = (value) => {
    setRole(value);
  };

  const onSubmitAlumni = async (data) => {
    setError("");
    setIsLoading(true);
    try {
      await register(data);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitStudent = async (data) => {
    setError("");
    setIsLoading(true);
    try {
      await register(data);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue={UserRole.STUDENT} onValueChange={handleRoleChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value={UserRole.STUDENT}>Student</TabsTrigger>
          <TabsTrigger value={UserRole.ALUMNI}>Alumni</TabsTrigger>
        </TabsList>

        {/* Student Registration Form */}
        <TabsContent value={UserRole.STUDENT}>
          <Form {...studentForm}>
            <form onSubmit={studentForm.handleSubmit(onSubmitStudent)} className="space-y-4">
              <FormField
                control={studentForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={studentForm.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your registration number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={studentForm.control}
                name="program"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your program" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {programOptions.map((program) => (
                          <SelectItem key={program} value={program}>
                            {program}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={studentForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={studentForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={studentForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register as Student"}
              </Button>
            </form>
          </Form>
        </TabsContent>

        {/* Alumni Registration Form */}
        <TabsContent value={UserRole.ALUMNI}>
          <Form {...alumniForm}>
            <form onSubmit={alumniForm.handleSubmit(onSubmitAlumni)} className="space-y-4">
              <FormField
                control={alumniForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={alumniForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={alumniForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Enter your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={alumniForm.control}
                  name="graduationYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Graduation Year</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select graduation year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {graduationYears.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={alumniForm.control}
                  name="program"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree / Program</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your program" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {programOptions.map((program) => (
                            <SelectItem key={program} value={program}>
                              {program}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={alumniForm.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your job title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={alumniForm.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={alumniForm.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {industryOptions.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={alumniForm.control}
                  name="workExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter years of experience" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={alumniForm.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (City, Country)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={alumniForm.control}
                name="linkedinProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Profile (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your LinkedIn profile URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={alumniForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={alumniForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register as Alumni"}
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RegisterForm;
