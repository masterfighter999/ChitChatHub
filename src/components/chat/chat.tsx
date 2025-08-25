"use client";

import { motion } from "framer-motion";
import type { Message, User, LoggedInUser } from "@/data/mock";
import { loggedInUser } from "@/data/mock";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { useState } from "react";

interface ChatProps {
  user: User;
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function Chat({ user, messages, onSendMessage, isLoading }: ChatProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMessages = messages.filter((message) =>
    message.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col w-full h-full"
    >
      <ChatHeader user={user} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex-1 flex flex-col bg-muted/20">
        <ChatMessages messages={filteredMessages} loggedInUser={loggedInUser} />
        <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
    </motion.div>
  );
}
