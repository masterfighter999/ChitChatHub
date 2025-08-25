import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/data/mock";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user: User;
  className?: string;
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  if (!user) {
    return null;
  }
  
  return (
    <Avatar className={cn("w-12 h-12", className)}>
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback>
        {user.name
          ?.split(" ")
          .map((n) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
}
