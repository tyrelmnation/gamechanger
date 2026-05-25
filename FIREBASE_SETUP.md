# Firebase Setup for Play Tracking

## 1. Create a Firebase Project
1. Go to https://console.firebase.google.com/
2. Click **Create a project** (or **Add project**)
3. Name it (e.g. "tyrelm-gamechanger"), accept terms, click **Create**
4. Once created, click **Continue**

## 2. Register a Web App
1. On the project overview page, click the **Web** icon (`</>`)
2. Type a nickname (e.g. "gamechanger-web"), **don't** check Firebase Hosting
3. Click **Register app**
4. You'll see the Firebase config object — copy it

## 3. Paste Config in index.html
1. Open `index.html`
2. Find the `FIREBASE_CONFIG` object (around line 423)
3. Replace the placeholder values with your config:

```js
const FIREBASE_CONFIG = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## 4. Create Firestore Database
1. In the Firebase console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (or **production mode** — see rules below)
4. Select a location close to you, click **Enable**
5. Create a collection named **`plays`** (just enter the name and click **Save** — you don't need to add a document)

## 5. Set Security Rules
Go to **Firestore Database → Rules** and set:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

This allows anyone to increment play counts (required for a client-only app with no authentication).

## 6. Test It
1. Open the app
2. Play a track
3. In the Firebase console → Firestore Database → **plays** collection, you should see a document with `count: 1`
4. The Console tab will show the global play count (badge says **live** instead of **local only**)

## 7. Optional: Set Up Per-Track Analytics
In the Firebase console → **Firestore Database → plays** collection, each track document has:
- `title` — the track name
- `count` — total plays across all users
- `lastPlayed` — timestamp of the most recent play

You can sort by `count` to see your most popular tracks, or add more fields to the `trackPlay()` function for deeper analytics.
