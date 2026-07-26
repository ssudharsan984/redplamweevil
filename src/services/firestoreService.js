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
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/firebase'

// Collections
const DETECTIONS = 'detections'
const TRAPS = 'traps'
const SETTINGS = 'settings'

// --- Detections ---
export const subscribeToDetections = (callback, maxResults = 50) => {
  const q = query(
    collection(db, DETECTIONS),
    orderBy('detectedAt', 'desc'),
    limit(maxResults)
  )
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    callback(data)
  })
}

export const subscribeToRecentDetections = (callback, count = 5) => {
  const q = query(
    collection(db, DETECTIONS),
    orderBy('detectedAt', 'desc'),
    limit(count)
  )
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    callback(data)
  })
}

export const subscribeToDetectionsByTrap = (trapId, callback) => {
  const q = query(
    collection(db, DETECTIONS),
    where('trapId', '==', trapId),
    orderBy('detectedAt', 'desc')
  )
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    callback(data)
  })
}

export const addDetection = (data) =>
  addDoc(collection(db, DETECTIONS), { ...data, detectedAt: serverTimestamp() })

export const deleteDetection = (id) => deleteDoc(doc(db, DETECTIONS, id))

// --- Traps ---
export const subscribeToTraps = (callback) => {
  const q = query(collection(db, TRAPS), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    callback(data)
  })
}

export const addTrap = (data) =>
  addDoc(collection(db, TRAPS), { ...data, createdAt: serverTimestamp() })

export const updateTrap = (id, data) => updateDoc(doc(db, TRAPS, id), data)

export const deleteTrap = (id) => deleteDoc(doc(db, TRAPS, id))

// --- Settings ---
export const subscribeToSettings = (userId, callback) => {
  return onSnapshot(doc(db, SETTINGS, userId), (snap) => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null)
  })
}

export const saveSettings = (userId, data) =>
  updateDoc(doc(db, SETTINGS, userId), data)

// --- YOLO API Integration (ready for future use) ---
// export const runYoloDetection = async (imageUrl) => {
//   const res = await fetch('https://your-python-api/detect', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ image_url: imageUrl }),
//   })
//   return res.json()
// }
