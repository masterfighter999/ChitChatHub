
export interface User {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  email: string;
}

export interface LoggedInUser extends User {}

export interface Message {
  id: number;
  sender: User;
  text: string;
  timestamp: Date;
}

// This function now dynamically gets the logged-in user's name.
export function getLoggedInUser(): LoggedInUser {
  let name = "Alex Doe"; // Default name
  if (typeof window !== 'undefined') {
    name = localStorage.getItem('loggedInUserName') || "Alex Doe";
  }
  return {
    id: "user0",
    name: name,
    avatar: `https://i.pravatar.cc/150?u=user0`,
    online: true,
    email: "guest@example.com",
  };
};

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

export const initialChatUsers: User[] = allUsers.slice(0, 3);


const loggedInUser = getLoggedInUser();

export const messages: Record<string, Message[]> = {
  user1: [
    {
      id: 1,
      sender: allUsers[0],
      text: "Hey Alex! How's it going?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: 2,
      sender: loggedInUser,
      text: "Hey Jane! I'm doing great, thanks for asking. Just working on this new chat app.",
      timestamp: new Date(Date.now() - 1000 * 60 * 4),
    },
    {
      id: 3,
      sender: allUsers[0],
      text: "Oh cool! It looks amazing. The liquid glass UI is a nice touch.",
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
    },
  ],
  user2: [
    {
      id: 4,
      sender: loggedInUser,
      text: "Hi Bob, are you free for a call tomorrow?",
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
    },
  ],
  user3: [
    {
      id: 5,
      sender: allUsers[2],
      text: "Can you send over the project files?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: 6,
      sender: loggedInUser,
      text: "Sure, I'll send them over in a bit.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
    },
  ],
  user4: [],
  user5: [
    {
      id: 7,
      sender: allUsers[4],
      text: "Let's catch up sometime this week!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
  ],
};
