
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import RegisterForm from "@/components/auth/RegisterForm";
import Layout from "@/components/layout/Layout";
import PageContainer from "@/components/layout/PageContainer";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setError("");
    setIsLoading(true);

    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error("Auth error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSuccess = () => {
    setIsLogin(true);
  };

  return (
    <Layout>
      <PageContainer className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {isLogin ? "Sign in" : "Create an account"}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? "Enter your credentials to access your account"
                : "Enter your information to create an account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {isLogin ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Password</FormLabel>
                          <Button variant="link" className="p-0 h-auto text-xs">
                            Forgot password?
                          </Button>
                        </div>
                        <FormControl>
                          <Input type="password" placeholder="Enter your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
              </Form>
            ) : (
              <RegisterForm onSuccess={handleRegisterSuccess} />
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              variant="link"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
            {isLogin && (
              <div className="text-sm text-muted-foreground text-center">
                <p>Demo Credentials:</p>
                <p className="mt-1">Admin: admin@example.com</p>
                <p>Student: student@example.com</p>
                <p>Alumni: alumni@example.com</p>
                <p className="mt-1">Password: password</p>
              </div>
            )}
          </CardFooter>
        </Card>
      </PageContainer>
    </Layout>
  );
};

export default Login;
