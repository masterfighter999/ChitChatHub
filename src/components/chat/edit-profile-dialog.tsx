
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import { LoggedInUser } from '@/data/mock';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface EditProfileDialogProps {
  user: LoggedInUser;
  onProfileUpdate: (avatarUrl: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function EditProfileDialog({ user, onProfileUpdate, isOpen, setIsOpen }: EditProfileDialogProps) {
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProfileUpdate(avatarUrl);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Settings className="w-5 h-5 text-muted-foreground" />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p>Edit Profile</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
            <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
                Make changes to your profile here. Click save when you're done.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="avatar-url" className="text-right">
                Avatar URL
                </Label>
                <Input
                id="avatar-url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="col-span-3"
                />
            </div>
            </div>
            <DialogFooter>
            <Button type="submit">Save changes</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
