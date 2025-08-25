"use client";

import { Phone, Search, Video, CircleDot } from "lucide-react";
import { User } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "./user-avatar";

interface ChatHeaderProps {
  user: User;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function ChatHeader({ user, searchQuery, setSearchQuery }: ChatHeaderProps) {
  return (
    <div className="p-4 border-b flex items-center justify-between bg-background/60 backdrop-blur-lg">
      <div className="flex items-center gap-3">
        <div className="relative">
          <UserAvatar user={user} className="w-10 h-10" />
          {user.online && (
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <CircleDot className={`h-2.5 w-2.5 ${user.online ? 'text-green-500' : 'text-gray-400'}`} />
            {user.online ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-48"
          />
        </div>
        <Button variant="ghost" size="icon">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
