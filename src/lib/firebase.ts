import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
// Replace these values with your actual Firebase project configuration
const firebaseConfig = {
 apiKey: "AIzaSyAvQt3RRKs8Ld-ykZyCHAtfAQFKPfT-ReA",
  authDomain: "adress-beauty-d78f0.firebaseapp.com",
  projectId: "adress-beauty-d78f0",
  storageBucket: "adress-beauty-d78f0.firebasestorage.app",
  messagingSenderId: "853386111120",
  appId: "1:853386111120:web:9e0fefce2874caeccd1015",
  measurementId: "G-9QQH4HSXP1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
