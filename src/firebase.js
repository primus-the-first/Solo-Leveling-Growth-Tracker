// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCuukbKYmJiz56gC0YB8bEg17S7gMgIoC8",
  authDomain: "level-zero-daebe.firebaseapp.com",
  projectId: "level-zero-daebe",
  storageBucket: "level-zero-daebe.firebasestorage.app",
  messagingSenderId: "746745372584",
  appId: "1:746745372584:web:84c0c62c8ab3b13af7479d",
  measurementId: "G-2J6Y2JJN0W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);

export default app;
