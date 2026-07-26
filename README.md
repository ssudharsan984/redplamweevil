# 🌴 Red Palm Weevil (RPW) Detection System

AI-Based Red Palm Weevil Detection and Monitoring PWA built with React + Vite + Firebase + Tailwind CSS.

## Tech Stack

- **Frontend**: React 18 + Vite 5
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore (real-time listeners)
- **Auth**: Firebase Authentication (Email/Password)
- **PWA**: vite-plugin-pwa (Workbox)
- **Deployment**: Netlify

---

## Project Structure

```
src/
├── firebase/         # Firebase config (firebase.js)
├── hooks/            # useAuth, useDetections, useTraps
├── services/         # firestoreService.js (all Firestore operations)
├── components/       # Navbar, Layout, DetectionCard, StatCard, etc.
├── pages/            # Login, Dashboard, DetectionHistory, TrapDetails, Settings
└── utils/            # helpers.js (formatDate, formatConfidence, etc.)
```

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Firebase
Edit `src/firebase/firebase.js` and replace the placeholder config with your Firebase project credentials:
```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  ...
}
```

### 3. Firebase Console Setup
- Enable **Email/Password** authentication
- Create a **Firestore** database
- Add the following Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Add PWA Icons
Place PNG icons in `public/icons/` (see `public/icons/README.md`).
Generate them at: https://realfavicongenerator.net

### 5. Run locally
```bash
npm run dev
```

---

## Firestore Data Schema

### `detections` collection
```json
{
  "trapId": "TRAP-001",
  "detected": true,
  "confidence": 0.92,
  "detectedAt": "<Firestore Timestamp>",
  "imageUrl": "https://...",
  "location": "North Field"
}
```

### `traps` collection
```json
{
  "trapId": "TRAP-001",
  "location": "North Field, Row 3",
  "description": "Near palm cluster A",
  "active": true,
  "createdAt": "<Firestore Timestamp>"
}
```

### `settings` collection (doc ID = user UID)
```json
{
  "notificationsEnabled": false,
  "alertThreshold": 0.7,
  "apiEndpoint": "https://your-yolo-api/detect",
  "apiKey": "...",
  "autoRefresh": true
}
```

---

## YOLO API Integration (Future)

Uncomment and configure in `src/services/firestoreService.js`:
```js
export const runYoloDetection = async (imageUrl) => {
  const res = await fetch('https://your-python-api/detect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: imageUrl }),
  })
  return res.json() // { detected: true, confidence: 0.92, bbox: [...] }
}
```

---

## Firebase Cloud Messaging (Future)

1. Uncomment FCM lines in `src/firebase/firebase.js`
2. Configure `public/firebase-messaging-sw.js`
3. Request notification permission in `Settings.jsx`

---

## Deploy to Netlify

```bash
npm run build
```
Then drag the `dist/` folder to Netlify, or connect your Git repo.
The `netlify.toml` handles SPA routing redirects automatically.

---

## Android APK via PWA Builder

1. Deploy to Netlify (must be HTTPS)
2. Visit https://www.pwabuilder.com
3. Enter your Netlify URL
4. Click **Package for stores** → **Android**
5. Download and sign the APK
