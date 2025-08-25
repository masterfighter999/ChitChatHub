
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { filterProfanity } from "@/lib/profanity";
import {
  users,
  messages as initialMessages,
  getLoggedInUser,
  Message,
  User,
  LoggedInUser,
} from "@/data/mock";
import { Sidebar } from "./sidebar";
import { Chat } from "./chat";
import { moderateMessage, ModerateMessageOutput } from "@/ai/flows/moderate-messages";

export function ChatLayout() {
  const [selectedUser, setSelectedUser] = useState<User>(users[0]);
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // This check is to prevent server-side rendering errors
    if (typeof window !== 'undefined') {
      setLoggedInUser(getLoggedInUser());
    }
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!loggedInUser) return;
    setIsLoading(true);
    try {
      const filteredText = filterProfanity(text);

      const moderationResult: ModerateMessageOutput = await moderateMessage({ message: filteredText });

      if (!moderationResult.isSafe) {
        toast({
          variant: "destructive",
          title: "Message not sent",
          description:
            moderationResult.reason || "This message violates our community guidelines.",
        });
        return;
      }

      const newMessage: Message = {
        id: Date.now(),
        sender: loggedInUser,
        text: filteredText,
        timestamp: new Date(),
      };

      setMessages((prev) => ({
        ...prev,
        [selectedUser.id]: [...(prev[selected.id] || []), newMessage],
      }));

      // Simulate a reply
      setTimeout(() => {
        const replyMessage: Message = {
          id: Date.now() + 1,
          sender: selectedUser,
          text: "Thanks for your message! I'll get back to you soon.",
          timestamp: new Date(),
        };
        setMessages((prev) => ({
          ...prev,
          [selectedUser.id]: [...(prev[selectedUser.id] || []), replyMessage],
        }));
      }, 1200);

    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!loggedInUser) {
    // You can render a loading spinner here while the user data is being fetched.
    return null;
  }

  return (
    <div className="h-full w-full max-w-7xl mx-auto flex rounded-2xl shadow-2xl shadow-primary/10 border bg-card/40 backdrop-blur-lg">
      <Sidebar
        users={users}
        loggedInUser={loggedInUser}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
      />
      <AnimatePresence>
        <Chat
          key={selectedUser.id}
          user={selectedUser}
          messages={messages[selectedUser.id] || []}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          loggedInUser={loggedInUser}
        />
      </AnimatePresence>
    </div>
  );
}
