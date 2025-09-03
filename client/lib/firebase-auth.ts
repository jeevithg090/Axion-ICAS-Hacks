import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import { auth, db } from "./firebase";

export type UserRole = "student" | "admin" | "faculty";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  studentId?: string;
  year?: number;
  program?: string;
  createdAt: string;
}

export async function signUpWithEmail(
  email: string, 
  password: string, 
  name: string, 
  role: UserRole = "student"
): Promise<UserProfile> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  const profile: UserProfile = {
    uid: user.uid,
    email: user.email!,
    name,
    role,
    createdAt: new Date().toISOString(),
  };
  
  await setDoc(doc(db, "users", user.uid), profile);
  return profile;
}

export async function signInWithEmail(email: string, password: string): Promise<UserProfile> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) {
    throw new Error("User profile not found");
  }
  
  return userDoc.data() as UserProfile;
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userDoc = await getDoc(doc(db, "users", uid));
  return userDoc.exists() ? userDoc.data() as UserProfile : null;
}

export function onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}