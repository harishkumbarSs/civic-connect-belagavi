// Firebase Configuration
// Replace with your Firebase project config from console.firebase.google.com
// For demo, we use mock values that will be replaced at build time

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { getFirestore, collection, doc, addDoc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot, getDocs, getDoc, Timestamp, GeoPoint, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase configuration - Replace with your actual config
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "civicconnect-belagavi.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "civicconnect-belagavi",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "civicconnect-belagavi.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abc123"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore
export const db = getFirestore(app);

// Storage
export const storage = getStorage(app);

// Auth helpers
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error('Google Sign-In Error:', error);
        throw error;
    }
};

export const signOut = async () => {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Sign Out Error:', error);
        throw error;
    }
};

// Re-export Firestore utilities
export {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    getDocs,
    getDoc,
    Timestamp,
    GeoPoint,
    serverTimestamp
};

// Re-export Storage utilities
export { ref, uploadBytes, getDownloadURL };

export default app;
