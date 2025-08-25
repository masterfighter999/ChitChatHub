
'use client';

import { useState, useEffect } from 'react';
import { ChatLayout } from "@/components/chat/chat-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function Home() {
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const loggedIn = localStorage.getItem('userIsLoggedIn') === 'true';
    setUserIsLoggedIn(loggedIn);
    if (!loggedIn) {
      router.push('/login');
    }
  }, [router]);

  if (!isClient) {
    // Render nothing or a loading spinner on the server to avoid hydration mismatch
    return null;
  }

  return (
    <main className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-background z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-accent/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>
      <div className="z-10 w-full h-full p-2 sm:p-4 md:p-6 lg:p-8">
        { userIsLoggedIn ? <ChatLayout /> : (
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-4xl font-bold mb-4">Welcome to ChitChatHub</h1>
                <p className="text-lg text-muted-foreground mb-8">Please log in to continue.</p>
                <Button asChild>
                    <Link href="/login">Go to Login</Link>
                </Button>
            </div>
        )}
      </div>
    </main>
  );
}
