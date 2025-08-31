import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { portalUsers } from "@/data/sample";

export type Role = "student" | "professor" | "admin";
export type User = { email: string; name: string; role: Role } | null;

type StoredUser = { email: string; name: string; role: Role; password: string };

type AuthCtx = {
  user: User;
  login: (email: string, password: string) => Promise<User>;
  signupStudent: (
    name: string,
    email: string,
    password: string,
  ) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);
const KEY = "icas_auth_user";
const USERS_KEY = "icas_users";

function seedUsers(): StoredUser[] {
  const extraAdmin: StoredUser = {
    email: "admin@icas.com",
    password: "hello123",
    name: "Admin",
    role: "admin",
  };
  const seeded = [
    ...portalUsers.map((u) => ({ ...u }) as StoredUser),
    extraAdmin,
  ];
  return seeded;
}

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const seeded = seedUsers();
  localStorage.setItem(USERS_KEY, JSON.stringify(seeded));
  return seeded;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [users, setUsers] = useState<StoredUser[]>([]);

  useEffect(() => {
    const u = loadUsers();
    setUsers(u);
    const raw = localStorage.getItem(KEY);
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      async login(email, password) {
        const match = users.find(
          (u) =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password,
        );
        if (!match) throw new Error("Invalid credentials");
        const u = {
          email: match.email,
          name: match.name,
          role: match.role,
        } as User;
        setUser(u);
        localStorage.setItem(KEY, JSON.stringify(u));
        return u;
      },
      async signupStudent(name, email, password) {
        const exists = users.some(
          (u) => u.email.toLowerCase() === email.toLowerCase(),
        );
        if (exists) throw new Error("Email already registered");
        const newUser: StoredUser = { name, email, password, role: "student" };
        const nextUsers = [...users, newUser];
        setUsers(nextUsers);
        localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
        const u = { email, name, role: "student" } as User;
        setUser(u);
        localStorage.setItem(KEY, JSON.stringify(u));
        return u;
      },
      logout() {
        setUser(null);
        localStorage.removeItem(KEY);
      },
    }),
    [user, users],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
