import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";

// Firebase configuration provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyC6GNrqqndo61rHIFn_GkxxE2TIYibRMbw",
  authDomain: "icasx-6b070.firebaseapp.com",
  projectId: "icasx-6b070",
  storageBucket: "icasx-6b070.firebasestorage.app",
  messagingSenderId: "239419153027",
  appId: "1:239419153027:web:09020403114639051659b6",
  measurementId: "G-92YSFBW1KF",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Ensure auth persists across reloads
setPersistence(auth, browserLocalPersistence).catch(() => {
  // Ignore persistence errors and continue with default session persistence
});

export default app;
