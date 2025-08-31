import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";

export type Role = "student" | "admin";
export type User = { uid: string; email: string; name: string; role: Role } | null;

type AuthCtx = {
  user: User;
  login: (email: string, password: string) => Promise<User>;
  signupStudent: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

function determineRole(u: FirebaseUser): Role {
  const envEmails = (import.meta.env.VITE_ADMIN_EMAILS as string | undefined)?.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean) ?? [];
  const envUids = (import.meta.env.VITE_ADMIN_UIDS as string | undefined)?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  const email = (u.email ?? "").toLowerCase();
  if (envEmails.includes(email) || envUids.includes(u.uid)) return "admin";
  return "student";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (!fbUser) {
        setUser(null);
        return;
      }
      const role = determineRole(fbUser);
      setUser({ uid: fbUser.uid, email: fbUser.email ?? "", name: fbUser.displayName ?? fbUser.email ?? "User", role });
    });
    return () => unsub();
  }, []);

  const value = useMemo<AuthCtx>(() => ({
    user,
    async login(email, password) {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = cred.user;
      const role = determineRole(fbUser);
      const u: User = { uid: fbUser.uid, email: fbUser.email ?? "", name: fbUser.displayName ?? fbUser.email ?? "User", role };
      setUser(u);
      return u;
    },
    async signupStudent(name, email, password) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
      const fbUser = auth.currentUser!;
      const role = determineRole(fbUser);
      const u: User = { uid: fbUser.uid, email: fbUser.email ?? "", name: fbUser.displayName ?? name ?? fbUser.email ?? "User", role };
      setUser(u);
      return u;
    },
    async logout() {
      await signOut(auth);
      setUser(null);
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
