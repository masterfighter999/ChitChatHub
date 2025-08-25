
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
  setDoc,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  arrayUnion,
  updateDoc,
  arrayRemove,
  getDoc,
  documentId,
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

  const fetchUserChatList = useCallback(async () => {
    if (!loggedInUser) return;
    try {
      const userDocRef = doc(db, "users", loggedInUser.id);
      
      const unsubscribe = onSnapshot(userDocRef, async (userDocSnap) => {
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const chatUserIds = userData.chatUsers || [];
          
          if (chatUserIds.length > 0) {
            const usersQuery = query(collection(db, 'users'), where(documentId(), 'in', chatUserIds));
            
            // Separate onSnapshot for the list of users
            const unsubscribeUsers = onSnapshot(usersQuery, (usersSnapshot) => {
              const chatUsers = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                online: doc.data().online || false,
              })) as User[];
              
              setUsers(chatUsers);

              if (chatUsers.length > 0) {
                 if (!selectedUser || !chatUsers.find(u => u.id === selectedUser.id)) {
                  setSelectedUser(chatUsers.find(u => u.id !== loggedInUser.id) || chatUsers[0]);
                }
              } else {
                setSelectedUser(null);
              }
            });
            // Return this new unsubscribe function
            return unsubscribeUsers;

          } else {
              setUsers([]);
              setSelectedUser(null);
          }
        }
      });
      return unsubscribe;

    } catch (error) {
      console.error("Error fetching user chat list:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch your chat list.",
      });
    }
  }, [loggedInUser, toast, selectedUser]);
  
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    const setupListener = async () => {
      unsubscribe = await fetchUserChatList();
    }
    if (loggedInUser?.id) {
        setupListener();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    }
  }, [loggedInUser, fetchUserChatList]);


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
    if (!loggedInUser) return;
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
      
      // Add user to both users' chatUsers list
      const loggedInUserDocRef = doc(db, "users", loggedInUser.id);
      await updateDoc(loggedInUserDocRef, {
        chatUsers: arrayUnion(userToAdd.id),
      });

      const otherUserDocRef = doc(db, "users", userToAdd.id);
      await updateDoc(otherUserDocRef, {
          chatUsers: arrayUnion(loggedInUser.id),
      });

      // Create a chat document for them if it doesn't exist
      const chatId = getChatId(loggedInUser.id, userToAdd.id);
      const chatDocRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatDocRef);

      if (!chatDoc.exists()) {
          await setDoc(chatDocRef, {
              users: [loggedInUser.id, userToAdd.id],
              lastMessage: null,
          });
      }

      toast({
          title: "User Added",
          description: `${userToAdd.name} has been added to your chat list.`
      })

    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add user.",
      });
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!loggedInUser) return;
    try {
      const loggedInUserDocRef = doc(db, "users", loggedInUser.id);
      await updateDoc(loggedInUserDocRef, {
        chatUsers: arrayRemove(userId),
      });
      
      const otherUserDocRef = doc(db, "users", userId);
      await updateDoc(otherUserDocRef, {
        chatUsers: arrayRemove(loggedInUser.id),
      });

      // Update the local state to reflect the removal
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      if (selectedUser?.id === userId) {
          setSelectedUser(users.length > 1 ? users.filter(user => user.id !== userId)[0] : null);
      }

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
