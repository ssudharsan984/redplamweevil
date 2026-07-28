import { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/firebase'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]           = useState(null)
  const [profile, setProfile]     = useState(null) // Firestore user doc
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        // Fetch Firestore profile
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
        setProfile(snap.exists() ? snap.data() : null)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    // Update lastLogin
    await setDoc(doc(db, 'users', cred.user.uid), { lastLogin: serverTimestamp() }, { merge: true })
    return cred
  }

  const register = async ({ fullName, email, phone, password }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: fullName })
    const userData = {
      uid: cred.user.uid,
      fullName,
      email,
      phone,
      role: 'Farmer',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    }
    await setDoc(doc(db, 'users', cred.user.uid), userData)
    setProfile(userData)
    return cred
  }

  const forgotPassword = (email) => sendPasswordResetEmail(auth, email)

  const logout = async () => {
    await signOut(auth)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, forgotPassword, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
