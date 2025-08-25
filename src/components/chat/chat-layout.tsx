
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { filterProfanity } from "@/lib/profanity";
import {
  allUsers,
  initialChatUsers,
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
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // This check is to prevent server-side rendering errors
    if (typeof window !== 'undefined') {
      const user = getLoggedInUser();
      setLoggedInUser(user);

      const storedUsersKey = `chatUsers_${user.id}`;
      const storedUsers = localStorage.getItem(storedUsersKey);
      
      let chatUsers: User[];
      if (storedUsers) {
        chatUsers = JSON.parse(storedUsers);
      } else {
        chatUsers = initialChatUsers;
        localStorage.setItem(storedUsersKey, JSON.stringify(chatUsers));
      }
      setUsers(chatUsers);
      if (chatUsers.length > 0) {
        setSelectedUser(chatUsers[0]);
      }
    }
  }, []);

  const updateUsersInStorage = (updatedUsers: User[]) => {
      if (loggedInUser) {
        const storedUsersKey = `chatUsers_${loggedInUser.id}`;
        localStorage.setItem(storedUsersKey, JSON.stringify(updatedUsers));
      }
  }

  const handleSendMessage = async (text: string) => {
    if (!loggedInUser || !selectedUser) return;
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
        [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage],
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

  const handleAddUser = (email: string) => {
    const userToAdd = allUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
  
    if (!userToAdd) {
      toast({
        variant: "destructive",
        title: "User not found",
        description: "No user with that email exists.",
      });
      return;
    }

    if(users.some(user => user.id === userToAdd.id)) {
        toast({
            variant: "destructive",
            title: "User already in list",
            description: "This user is already in your chat list.",
        });
        return;
    }
  
    const newUsers = [...users, userToAdd];
    setUsers(newUsers);
    updateUsersInStorage(newUsers);

    if(!selectedUser) {
        setSelectedUser(userToAdd);
    }
  };

  const handleRemoveUser = (userId: string) => {
    const newUsers = users.filter(user => user.id !== userId);
    setUsers(newUsers);
    updateUsersInStorage(newUsers);

    if (selectedUser?.id === userId) {
        if (newUsers.length > 0) {
            setSelectedUser(newUsers[0]);
        } else {
            setSelectedUser(null);
        }
    }
  };

  const handleProfileUpdate = (newAvatarUrl: string) => {
    if (loggedInUser) {
      const updatedUser = { ...loggedInUser, avatar: newAvatarUrl };
      setLoggedInUser(updatedUser);
      localStorage.setItem('loggedInUserAvatar', newAvatarUrl);
      toast({
        title: "Profile Updated",
        description: "Your profile picture has been changed.",
      });
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
        onAddUser={handleAddUser}
        onRemoveUser={handleRemoveUser}
        onProfileUpdate={handleProfileUpdate}
      />
      <AnimatePresence>
        {selectedUser ? (
            <Chat
                key={selectedUser.id}
                user={selectedUser}
                messages={messages[selectedUser.id] || []}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                loggedInUser={loggedInUser}
            />
        ) : (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">No users in your chat list. Add one to start chatting!</p>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}
