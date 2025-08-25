"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Message, User } from "@/data/mock";
import { UserAvatar } from "./user-avatar";
import { format } from "date-fns";

interface ChatMessagesProps {
  messages: Message[];
  loggedInUser: User;
}

export function ChatMessages({ messages, loggedInUser }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      <AnimatePresence initial={false}>
        {messages.map((message) => {
          const isSender = message.sender.id === loggedInUser.id;
          return (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn(
                "flex items-end gap-2",
                isSender ? "justify-end" : "justify-start"
              )}
            >
              {!isSender && (
                <UserAvatar user={message.sender} className="w-8 h-8" />
              )}
              <div
                className={cn(
                  "max-w-xs md:max-w-md lg:max-w-lg rounded-2xl p-3 text-sm",
                  isSender
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-background rounded-bl-none border"
                )}
              >
                <p className="mb-1">{message.text}</p>
                <p className={cn("text-xs", isSender ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  {format(message.timestamp, "HH:mm")}
                </p>
              </div>
              {isSender && (
                <UserAvatar user={message.sender} className="w-8 h-8" />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
