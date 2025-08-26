Web app link - https://chit-chat-hub-5wx7.vercel.app

# ChitChatHub

ChitChatHub is a modern, real-time chat application built with Next.js and Firebase. It features AI-powered message moderation to ensure a safe and friendly environment for users.

## ✨ Features

- **Real-time Messaging:** Instantaneous message delivery between users powered by Firestore.
- **User Authentication:** Secure user sign-up and login functionality with Firebase Auth.
- **AI-Powered Moderation:** Messages are automatically checked by a Genkit AI flow to filter out inappropriate content before it's sent.
- **User Management:** Easily add new users to your chat list by email or remove them.
- **Profile Customization:** Users can update their profile avatar.
- **Responsive Design:** A clean and modern UI that works seamlessly across all devices.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **UI:** [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [ShadCN/UI](https://ui.shadcn.com/)
- **Backend & Database:** [Firebase](https://firebase.google.com/) (Authentication, Firestore)
- **Generative AI:** [Genkit](https://firebase.google.com/docs/genkit) for AI-powered content moderation.

## 🚀 Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or a compatible package manager

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Environment Variables

The application requires API keys and configuration details for Firebase and Google AI services.

Create a new file named `.env.local` in the root of your project by copying the `.env` file.

```bash
cp .env .env.local
```

You will need to populate `.env.local` with the following keys:

- **Firebase Configuration:** You need a Firebase project to run this application.
  1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
  2. In your project, go to **Project Settings** > **General**.
  3. Under "Your apps", create a new Web App.
  4. Firebase will provide you with a `firebaseConfig` object. Copy the values into the corresponding `NEXT_PUBLIC_FIREBASE_*` variables in your `.env.local` file.

- **Google AI API Key:**
  1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey) to get your API key.
  2. Add the key to your `.env.local` file.

Your `.env.local` file should look like this:

```
# Genkit/Google AI
GEMINI_API_KEY="YOUR_GOOGLE_API_KEY"

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"
```

### 4. Run the Development Server

Once the environment variables are set, you can start the Next.js development server:

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).

### 5. (Optional) Run the Genkit Inspector

To inspect, test, and debug your AI flows, you can run the Genkit Inspector tool in a separate terminal:

```bash
npm run genkit:dev
```

The inspector will be available at [http://localhost:4000](http://localhost:4000).
