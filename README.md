# 🗳️ San Vote App

A fully open-source community merch voting platform for $San — where the best design wins.

---

## ✅ Features

- 🥇 Top 5 most voted designs displayed first
- 🖼 View all submissions
- 🗳 Anonymous voting (1 vote per design per IP per day)
- 🔐 Admin-only upload page
- ☁️ Firebase backend (Firestore + Storage ready)
- 🌐 Deployable to Vercel in minutes

---

## 🧰 Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cloudinary](https://cloudinary.com/) or Firebase Storage (for image upload)

---

## 🧑‍💻 Setup Guide

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/san-vote-app.git
cd san-vote-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Setup
- Go to [Firebase Console](https://console.firebase.google.com)
- Create a project
- Enable:
  - Firestore (start in test mode)
  - Storage (optional)
- Copy config from **Project Settings > Web App** and paste into `.env.local`

### 4. Configure `.env.local`
Create a file named `.env.local` in the root:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_ADMIN_PASS=your_secret_password
```

---

## ▶️ Run Locally
```bash
npm run dev
```
Visit: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Test Admin Upload
1. Go to `/admin`
2. Enter the password set in `.env.local`
3. Upload image + title  
   > Note: You must configure image upload (Cloudinary or Firebase Storage).

---

## 🔐 Optional Firebase Rules
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /designs/{docId} {
      allow read: if true;
      allow write: if request.auth != null;  // or secure further
    }
    match /votes/{voteId} {
      allow read, write: if true;
    }
  }
}
```

---

## ☁️ Deploy to Vercel

1. Push to GitHub
2. Go to [https://vercel.com](https://vercel.com)
3. Import the repo
4. Add all `.env.local` variables in Vercel’s dashboard
5. Click **Deploy**

✅ Done. Your voting site is live!

---

## 💬 Need Help?
Open an issue or contact the creator. Made with ❤️ for the $San community.
