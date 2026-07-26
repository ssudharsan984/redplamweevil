// Firebase Cloud Messaging Service Worker
// To enable push notifications, uncomment the lines below

// importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js')
// importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js')

// firebase.initializeApp({
//   apiKey: "AIzaSyA6jKjeiFIY_4gVRg4rJhrLcBVa-0MCErA",
//   authDomain: "rpw-detection-system.firebaseapp.com",
//   projectId: "rpw-detection-system",
//   storageBucket: "rpw-detection-system.firebasestorage.app",
//   messagingSenderId: "867471125008",
//   appId: "1:867471125008:web:ebc2417d108691f8667895"
// })

// const messaging = firebase.messaging()

// messaging.onBackgroundMessage((payload) => {
//   const { title, body } = payload.notification
//   self.registration.showNotification(title, {
//     body,
//     icon: '/icons/icon-192x192.png',
//     badge: '/icons/icon-96x96.png',
//     vibrate: [200, 100, 200],
//     data: payload.data,
//   })
// })

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))

// Handle notification click — open the app
self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  e.waitUntil(clients.openWindow('/dashboard'))
})
