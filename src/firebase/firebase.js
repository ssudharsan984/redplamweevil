import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyA6jKjeiFIY_4gVRg4rJhrLcBVa-0MCErA",
  authDomain: "rpw-detection-system.firebaseapp.com",
  projectId: "rpw-detection-system",
  storageBucket: "rpw-detection-system.firebasestorage.app",
  messagingSenderId: "867471125008",
  appId: "1:867471125008:web:ebc2417d108691f8667895"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)

// FCM: import { getMessaging } from 'firebase/messaging'
// export const messaging = getMessaging(app)

export default app
