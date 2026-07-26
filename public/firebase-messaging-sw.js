// Firebase Cloud Messaging Service Worker
// Uncomment and configure when FCM is ready

// importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js')
// importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js')

// firebase.initializeApp({
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// })

// const messaging = firebase.messaging()

// messaging.onBackgroundMessage((payload) => {
//   const { title, body, icon } = payload.notification
//   self.registration.showNotification(title, { body, icon: icon || '/icons/icon-192x192.png' })
// })

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))
