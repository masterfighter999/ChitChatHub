
"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { moderateMessage, ModerateMessageOutput } from "@/ai/flows/moderate-messages";
import { Message, User, LoggedInUser } from "@/data/mock";
import { Sidebar } from "./sidebar";
import { Chat } from "./chat";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  arrayUnion,
  getDoc,
  documentId,
  writeBatch,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";

interface ChatLayoutProps {
  loggedInUser: LoggedInUser;
}

export function ChatLayout({ loggedInUser }: ChatLayoutProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getChatId = (uid1: string, uid2: string) => {
    return [uid1, uid2].sort().join('_');
  };

  const fetchUserChatList = useCallback(() => {
    if (!loggedInUser?.id) return;

    const userDocRef = doc(db, "users", loggedInUser.id);
    
    const unsubscribe = onSnapshot(userDocRef, async (userDoc) => {
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const chatUserIds = userData.chatUsers || [];

        if (chatUserIds.length > 0) {
          const usersQuery = query(collection(db, "users"), where(documentId(), "in", chatUserIds));
          const usersSnapshot = await getDocs(usersQuery);
          const chatUsers = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            online: doc.data().online || false,
          })) as User[];
          
          setUsers(chatUsers);

          if (chatUsers.length > 0) {
            if (!selectedUser || !chatUsers.some(u => u.id === selectedUser.id)) {
              setSelectedUser(chatUsers[0]);
            }
          } else {
            setSelectedUser(null);
          }
        } else {
          setUsers([]);
          setSelectedUser(null);
        }
      }
    });

    return unsubscribe;
  }, [loggedInUser?.id, selectedUser]);
  
  useEffect(() => {
    if (!loggedInUser?.id) return;
    const unsubscribe = fetchUserChatList();
    return () => {
      if (unsubscribe) unsubscribe();
    }
  }, [loggedInUser?.id, fetchUserChatList]);


  useEffect(() => {
    if (!selectedUser || !loggedInUser) return;

    const chatId = getChatId(loggedInUser.id, selectedUser.id);
    const messagesQuery = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const newMessages = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: (data.timestamp as Timestamp).toDate(),
        } as Message;
      });
      setMessages((prev) => ({ ...prev, [selectedUser.id]: newMessages }));
    }, (error) => {
      console.error("Error fetching messages: ", error);
    });

    return () => unsubscribe();
  }, [selectedUser, loggedInUser]);

  const handleSendMessage = async (text: string) => {
    if (!loggedInUser || !selectedUser) return;
    setIsLoading(true);
    try {
      const moderationResult: ModerateMessageOutput = await moderateMessage({ message: text });

      if (!moderationResult.isSafe) {
        toast({
          variant: "destructive",
          title: "Message not sent",
          description:
            moderationResult.reason || "This message violates our community guidelines.",
        });
        return;
      }
      
      const chatId = getChatId(loggedInUser.id, selectedUser.id);
      const messagesCol = collection(db, "chats", chatId, "messages");

      const senderData = {
          id: loggedInUser.id,
          name: loggedInUser.name,
          avatar: loggedInUser.avatar,
          email: loggedInUser.email
      };

      await addDoc(messagesCol, {
        sender: senderData,
        text: text,
        timestamp: Timestamp.now(),
      });
      
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

  const handleAddUser = async (email: string) => {
    if (!loggedInUser || !loggedInUser.email) return;

    if (email.toLowerCase() === loggedInUser.email.toLowerCase()) {
        toast({
          variant: "destructive",
          title: "Cannot add yourself",
          description: "You cannot add yourself to your chat list.",
        });
        return;
    }
    
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast({
          variant: "destructive",
          title: "User not found",
          description: "No user with that email exists.",
        });
        return;
      }

      const userToAddDoc = querySnapshot.docs[0];
      const userToAdd = { id: userToAddDoc.id, ...userToAddDoc.data() } as User;


      if (users.some((user) => user.id === userToAdd.id)) {
        toast({
          variant: "destructive",
          title: "User already in list",
          description: "This user is already in your chat list.",
        });
        return;
      }
      
      const batch = writeBatch(db);

      // 1. Proactively create the chat document to prevent race conditions
      const chatId = getChatId(loggedInUser.id, userToAdd.id);
      const chatDocRef = doc(db, "chats", chatId);
      batch.set(chatDocRef, {
        users: [loggedInUser.id, userToAdd.id],
        lastMessage: null,
      }, { merge: true }); // Use merge to avoid overwriting if it somehow exists

      // 2. Add user to each other's chat list
      const loggedInUserDocRef = doc(db, "users", loggedInUser.id);
      batch.update(loggedInUserDocRef, {
        chatUsers: arrayUnion(userToAdd.id),
      });

      const otherUserDocRef = doc(db, "users", userToAdd.id);
      batch.update(otherUserDocRef, {
          chatUsers: arrayUnion(loggedInUser.id),
      });

      await batch.commit();

      toast({
          title: "User Added",
          description: `${userToAdd.name} has been added to your chat list.`
      })

    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add user. Please check permissions and try again.",
      });
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!loggedInUser) return;
    try {
        const batch = writeBatch(db);

        // Remove from each other's chat list
        const loggedInUserDocRef = doc(db, "users", loggedInUser.id);
        batch.update(loggedInUserDocRef, {
            chatUsers: arrayRemove(userId),
        });
        
        const otherUserDocRef = doc(db, "users", userId);
        batch.update(otherUserDocRef, {
            chatUsers: arrayRemove(loggedInUser.id),
        });
        
        await batch.commit();

        toast({
            title: "User removed",
            description: "The user has been removed from your chat list."
        })
    } catch (error) {
        console.error("Error removing user:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to remove user."
        })
    }
  };

  const handleProfileUpdate = async (newAvatarUrl: string) => {
    if (loggedInUser) {
        try {
            const user = auth.currentUser;
            if (user) {
              const userDocRef = doc(db, "users", user.uid);
              await updateDoc(userDocRef, { photoURL: newAvatarUrl });
              toast({
                  title: "Profile Updated",
                  description: "Your profile picture has been changed.",
              });
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update profile.",
            });
        }
    }
  };

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
            <p className="text-muted-foreground">Select a user to start chatting or add a new one.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
