
'use client';

import { useState, useEffect } from 'react';
import { ChatLayout } from "@/components/chat/chat-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { onAuthStateChanged, User as FirebaseAuthUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LoggedInUser } from '@/data/mock';

export default function Home() {
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const unsubscribe = onAuthStateChanged(auth, (user: FirebaseAuthUser | null) => {
      if (user) {
        setLoggedInUser({
          id: user.uid,
          name: user.displayName || 'Anonymous',
          avatar: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
          online: true,
          email: user.email || ''
        });
      } else {
        setLoggedInUser(null);
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!isClient || !loggedInUser) {
    // Render nothing or a loading spinner on the server/during auth check
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
        <ChatLayout loggedInUser={loggedInUser} />
      </div>
    </main>
  );
}
