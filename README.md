Web App Link - https://chit-chat-hub-ectb.vercel.app/

# ChitChatHub

ChitChatHub is a modern, real-time chat application built with Next.js and Firebase. It features AI-powered content moderation to ensure conversations remain safe and appropriate. The user interface is designed with ShadCN UI and Tailwind CSS for a clean, responsive, and aesthetically pleasing experience.

## Core Features

-   **Real-Time Messaging:** Instantaneous message delivery powered by Cloud Firestore.
-   **User Authentication:** Secure sign-up and login functionality with Firebase Authentication.
-   **AI-Powered Moderation:** Messages are automatically checked for inappropriate content using Genkit and the Gemini API before being sent.
-   **User Management:** Add and remove users from your chat list.
-   **Profile Customization:** Users can update their profile information, including their avatar.
-   **Responsive Design:** A seamless experience across desktop and mobile devices.
-   **Search:** Quickly find messages within a conversation.

## Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **Database & Auth:** [Firebase](https://firebase.google.com/) (Firestore, Authentication)
-   **AI/Generative AI:** [Genkit (Gemini API)](https://firebase.google.com/docs/genkit)
-   **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Deployment:** [Vercel](https://vercel.com/)

## Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

-   Node.js (v18 or later)
-   A Google Firebase account

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone <your-repository-url>
cd ChitChatHub
```

### 2. Install Dependencies

Install the necessary npm packages:

```bash
npm install
```

### 3. Set Up Firebase

1.  Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  Within your project, enable **Authentication** (with the Email/Password provider) and **Cloud Firestore**.
3.  When setting up Firestore, start in **Production mode**. The application's security rules are designed for this. You will be prompted to add them later.
4.  In your Firebase project settings, find your web app's configuration object.

### 4. Configure Environment Variables

Create a file named `.env.local` in the root of your project. Copy the contents of your Firebase web app config into this file, like so:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
```

### 5. Configure Firestore Security Rules

Go to the **Firestore Database** section in your Firebase Console and click on the **Rules** tab. Replace the default rules with the ones provided in `firestore.rules`. This is crucial for the application to have the correct permissions to read and write data.

### 6. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser to see the application. You can now create accounts and start chatting!

## Deployment

This application is configured for easy deployment on [Vercel](https://vercel.com/).

1.  Push your code to a Git repository (GitHub, GitLab, etc.).
2.  Import the repository into Vercel.
3.  Add the environment variables from your `.env.local` file to the Vercel project settings.
4.  Deploy! Vercel will automatically build and deploy your application.
