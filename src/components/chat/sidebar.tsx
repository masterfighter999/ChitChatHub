
"use client";

import { useState } from 'react';
import { LogOut, UserPlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { User, LoggedInUser } from "@/data/mock";
import { UserAvatar } from "./user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChitChatHubLogo } from "@/components/icons";
import { useRouter } from 'next/navigation';

interface SidebarProps {
  users: User[];
  loggedInUser: LoggedInUser;
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
  onAddUser: (email: string) => void;
  onRemoveUser: (userId: string) => void;
}

export function Sidebar({ users, loggedInUser, selectedUser, onSelectUser, onAddUser, onRemoveUser }: SidebarProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('userIsLoggedIn');
    localStorage.removeItem('loggedInUserName');
    // We could also clear the user-specific chat list here, but let's keep it for when they log back in.
    router.push('/login');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if(email.trim()) {
        onAddUser(email);
        setEmail('');
    }
  }

  return (
    <aside className="w-80 border-r flex flex-col bg-background/60 backdrop-blur-lg">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <ChitChatHubLogo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold text-foreground">ChitChatHub</h1>
        </div>
      </div>
      <div className="p-4 border-b">
        <h2 className="text-md font-semibold text-foreground mb-2">Add a new user</h2>
        <form onSubmit={handleAddUser} className="flex gap-2">
            <Input 
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9"
            />
            <Button type="submit" size="icon" className="h-9 w-9">
                <UserPlus className="h-4 w-4" />
            </Button>
        </form>
      </div>
      <div className="flex-1 overflow-y-auto">
        <h2 className="p-4 text-lg font-semibold text-foreground">Online Users</h2>
        <div className="px-2 space-y-1">
          <TooltipProvider delayDuration={0}>
          {users.map((user) => (
            <div key={user.id} className="relative group/user-item">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onSelectUser(user)}
                    className={cn(
                      "w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors",
                      selectedUser?.id === user.id
                        ? "bg-primary/20 text-primary-foreground"
                        : "hover:bg-accent"
                    )}
                  >
                    <div className="relative">
                      <UserAvatar user={user} className="w-10 h-10" />
                      {user.online && (
                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 truncate">
                      <p className="font-semibold text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {user.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{user.name}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1/2 right-2 -translate-y-1/2 h-7 w-7 text-muted-foreground opacity-0 group-hover/user-item:opacity-100 transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemoveUser(user.id)
                        }}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>Remove User</p>
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
          </TooltipProvider>
        </div>
      </div>
      <div className="p-4 border-t mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserAvatar user={loggedInUser} className="w-10 h-10" />
            <div>
              <p className="font-semibold text-foreground">{loggedInUser.name}</p>
              <p className="text-sm text-muted-foreground">My Account</p>
            </div>
          </div>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="w-5 h-5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </aside>
  );
}
