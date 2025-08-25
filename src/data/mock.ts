
import { Timestamp } from "firebase/firestore";

export interface User {
  id: string;
  name: string;
  avatar: string;
  online?: boolean; // Online status can be managed via Firestore presence
  email: string;
}

export interface LoggedInUser extends User {}

export interface Message {
  id: string; // Firestore document ID
  sender: User;
  text: string;
  timestamp: Date | Timestamp;
}

// Mock data is no longer the primary source of truth.
// It can be kept for reference or completely removed.

export const allUsers: User[] = [
    {
      id: "user1",
      name: "Jane Smith",
      avatar: `https://i.pravatar.cc/150?u=user1`,
      online: true,
      email: "jane.smith@example.com",
    },
    {
      id: "user2",
      name: "Bob Johnson",
      avatar: `https://i.pravatar.cc/150?u=user2`,
      online: false,
      email: "bob.johnson@example.com",
    },
    {
      id: "user3",
      name: "Alice Williams",
      avatar: `https://i.pravatar.cc/150?u=user3`,
      online: true,
      email: "alice.williams@example.com",
    },
    {
      id: "user4",
      name: "Charlie Brown",
      avatar: `https://i.pravatar.cc/150?u=user4`,
      online: false,
      email: "charlie.brown@example.com",
    },
    {
      id: "user5",
      name: "Diana Miller",
      avatar: `https://i.pravatar.cc/150?u=user5`,
      online: true,
      email: "diana.miller@example.com",
    },
  ];
