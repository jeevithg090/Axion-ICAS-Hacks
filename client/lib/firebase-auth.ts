import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { normalizeRole, type Role } from "./auth-users";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: Role;
  studentId?: string;
  year?: number;
  program?: string;
  createdAt: string;
}

function requireAuth() {
  if (!auth || !db) throw new Error("Firebase is not configured");
  return { auth, db };
}

/** Creates a Firebase Auth account plus its `users/{uid}` profile. New accounts are always students. */
export async function signUpWithEmail(
  email: string,
  password: string,
  name: string,
): Promise<UserProfile> {
  const { auth, db } = requireAuth();
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName: name }).catch(() => undefined);

  const profile: UserProfile = {
    uid: user.uid,
    email: user.email ?? email,
    name,
    role: "student",
    createdAt: new Date().toISOString(),
  };
  await setDoc(doc(db, "users", user.uid), profile);
  return profile;
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<void> {
  const { auth } = requireAuth();
  await signInWithEmailAndPassword(auth, email, password);
}

export async function signOutUser(): Promise<void> {
  if (auth) await signOut(auth);
}

/** Loads the Firestore profile for a signed-in user, falling back to Auth data. */
export async function getUserProfile(user: FirebaseUser): Promise<UserProfile> {
  const { db } = requireAuth();
  const snap = await getDoc(doc(db, "users", user.uid));
  const data = snap.exists() ? (snap.data() as Partial<UserProfile>) : {};
  return {
    ...data,
    uid: user.uid,
    email: data.email ?? user.email ?? "",
    name: data.name ?? user.displayName ?? user.email ?? "Student",
    role: normalizeRole(data.role),
    createdAt: data.createdAt ?? new Date().toISOString(),
  };
}

export function onAuthStateChange(
  callback: (user: FirebaseUser | null) => void,
) {
  if (!auth) {
    callback(null);
    return () => undefined;
  }
  return onAuthStateChanged(auth, callback);
}

/** Maps Firebase Auth error codes to messages suitable for the login form. */
export function describeAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password";
    case "auth/email-already-in-use":
      return "Email already registered";
    case "auth/weak-password":
      return "Password must be at least 6 characters";
    case "auth/invalid-email":
      return "Please enter a valid email address";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    default:
      return (err as Error)?.message || "Authentication failed";
  }
}
