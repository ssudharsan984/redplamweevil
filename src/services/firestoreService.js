import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  where,
  setDoc,
  getDocs,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase/firebase'

const TRAPS          = 'traps'
const SETTINGS       = 'settings'
const NOTIFICATIONS  = 'notifications'

// ─── Traps (main collection — written by Python YOLO script) ─────────────────

/**
 * Subscribe to all traps ordered by latest timestamp.
 * Firestore doc shape:
 * { trapId, status, confidence, imageUrl, timestamp, location?, description?, active? }
 */
export const subscribeToTraps = (callback) => {
  const q = query(collection(db, TRAPS), orderBy('timestamp', 'desc'))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

export const subscribeToRecentTraps = (callback, count = 6) => {
  const q = query(collection(db, TRAPS), orderBy('timestamp', 'desc'), limit(count))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

export const subscribeToTrap = (trapDocId, callback) => {
  return onSnapshot(doc(db, TRAPS, trapDocId), (snap) => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() })
  })
}

/** Manually add a trap record (admin use) */
export const addTrap = (data) =>
  addDoc(collection(db, TRAPS), { ...data, timestamp: serverTimestamp() })

export const updateTrap = (id, data) => updateDoc(doc(db, TRAPS, id), data)

export const deleteTrap = (id) => deleteDoc(doc(db, TRAPS, id))

// ─── Firebase Storage ─────────────────────────────────────────────────────────

/**
 * Upload an image file to Firebase Storage and return the download URL.
 * Path: detections/{trapId}/{timestamp}_{filename}
 */
export const uploadDetectionImage = async (file, trapId) => {
  const path = `detections/${trapId}/${Date.now()}_${file.name}`
  const storageRef = ref(storage, path)
  const snapshot = await uploadBytes(storageRef, file)
  return getDownloadURL(snapshot.ref)
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export const subscribeToSettings = (userId, callback) => {
  return onSnapshot(doc(db, SETTINGS, userId), (snap) => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null)
  })
}

export const saveSettings = (userId, data) =>
  setDoc(doc(db, SETTINGS, userId), data, { merge: true })

// ─── Notifications (Firestore collection) ─────────────────────────────────────

/**
 * Subscribe to all notifications ordered by latest timestamp.
 * Firestore doc shape:
 * { title, message, type, read, userId?, trapId?, timestamp }
 *
 * Optionally filter by userId.
 */
export const subscribeToNotifications = (callback, userId = null) => {
  let q
  if (userId) {
    q = query(
      collection(db, NOTIFICATIONS),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    )
  } else {
    q = query(collection(db, NOTIFICATIONS), orderBy('timestamp', 'desc'))
  }
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

export const subscribeToRecentNotifications = (callback, count = 5, userId = null) => {
  let q
  if (userId) {
    q = query(
      collection(db, NOTIFICATIONS),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(count)
    )
  } else {
    q = query(
      collection(db, NOTIFICATIONS),
      orderBy('timestamp', 'desc'),
      limit(count)
    )
  }
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

/** Mark a single notification as read */
export const markNotificationRead = (notifId) =>
  updateDoc(doc(db, NOTIFICATIONS, notifId), { read: true })

/** Mark all notifications as read for a user */
export const markAllNotificationsRead = async (userId) => {
  const snapshot = await getDocs(
    query(
      collection(db, NOTIFICATIONS),
      where('userId', '==', userId),
      where('read', '==', false)
    )
  )
  const batch = writeBatch(db)
  snapshot.docs.forEach((d) => batch.update(d.ref, { read: true }))
  return batch.commit()
}

// ─── Python YOLO Integration (ready — no changes needed in frontend) ──────────
//
// Your Python script should write to Firestore like this:
//
// import firebase_admin
// from firebase_admin import credentials, firestore, storage
//
// db.collection('traps').add({
//   'trapId':     'TRAP001',
//   'status':     'RPW Detected',   # or 'No RPW'
//   'confidence': 96,               # integer 0-100
//   'imageUrl':   '<Storage download URL>',
//   'timestamp':  firestore.SERVER_TIMESTAMP,
//   'location':   'North Field',
// })
