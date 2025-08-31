import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { portalUsers } from "@/data/sample";

type Role = "student" | "professor" | "admin";
export type User = { email: string; name: string; role: Role } | null;

type AuthCtx = {
  user: User;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);
const KEY = "icas_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const value = useMemo<AuthCtx>(() => ({
    user,
    async login(email, password) {
      const match = portalUsers.find((u) => u.email === email && u.password === password);
      if (!match) return false;
      const u = { email: match.email, name: match.name, role: match.role as Role } as User;
      setUser(u);
      localStorage.setItem(KEY, JSON.stringify(u));
      return true;
    },
    logout() {
      setUser(null);
      localStorage.removeItem(KEY);
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
