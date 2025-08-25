
'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");

  const handleSignup = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you'd have user creation logic here.
    // For now, we'll just redirect to the home page and log the user in.
    localStorage.setItem('userIsLoggedIn', 'true');
    localStorage.setItem('loggedInUserName', fullName);
    router.push('/');
  };

  return (
    <main className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-background z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-accent/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>
      <div className="z-10">
        <Card className="mx-auto max-w-sm w-[350px] shadow-2xl shadow-primary/10 bg-card/40 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="full-name">Full name</Label>
                  <Input 
                    id="full-name" 
                    placeholder="Alex Doe" 
                    required 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  <UserPlus className="mr-2 h-4 w-4" /> Create account
                </Button>
              </div>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="underline">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
