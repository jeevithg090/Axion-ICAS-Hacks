import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { portalUsers } from "@/data/sample";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import {
  describeAuthError,
  getUserProfile,
  onAuthStateChange,
  signInWithEmail,
  signOutUser,
  signUpWithEmail,
} from "@/lib/firebase-auth";
import {
  addStudent,
  findUser,
  type AuthUser,
  type Role,
  type StoredUser,
} from "@/lib/auth-users";

export type { AuthUser, Role };
export type User = AuthUser | null;

export type AuthMode = "firebase" | "demo";

type AuthCtx = {
  user: User;
  /** True until the initial session has been restored. */
  loading: boolean;
  mode: AuthMode;
  login: (email: string, password: string) => Promise<AuthUser>;
  signupStudent: (
    name: string,
    email: string,
    password: string,
  ) => Promise<AuthUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

const SESSION_KEY = "icas_auth_user";
const USERS_KEY = "icas_users";

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable (private mode); the session just won't persist.
  }
}

function loadDemoUsers(): StoredUser[] {
  const stored = readJson<StoredUser[]>(USERS_KEY);
  if (Array.isArray(stored) && stored.length) return stored;
  const seeded = portalUsers.map((u) => ({ ...u }));
  writeJson(USERS_KEY, seeded);
  return seeded;
}

/** Local, localStorage-backed auth used when Firebase is not configured. */
function useDemoAuth(): AuthCtx {
  const [users, setUsers] = useState<StoredUser[]>(loadDemoUsers);
  const [user, setUser] = useState<User>(() => readJson<AuthUser>(SESSION_KEY));

  return useMemo<AuthCtx>(
    () => ({
      user,
      loading: false,
      mode: "demo",
      async login(email, password) {
        const match = findUser(users, email, password);
        if (!match) throw new Error("Invalid email or password");
        setUser(match);
        writeJson(SESSION_KEY, match);
        return match;
      },
      async signupStudent(name, email, password) {
        const next = addStudent(users, { name, email, password });
        setUsers(next.users);
        writeJson(USERS_KEY, next.users);
        setUser(next.user);
        writeJson(SESSION_KEY, next.user);
        return next.user;
      },
      async logout() {
        setUser(null);
        writeJson(SESSION_KEY, null);
      },
    }),
    [user, users],
  );
}

/** Firebase Authentication + Firestore `users/{uid}` profiles. */
function useFirebaseAuth(): AuthCtx {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChange(async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const profile = await getUserProfile(fbUser);
        setUser({
          uid: profile.uid,
          email: profile.email,
          name: profile.name,
          role: profile.role,
        });
      } catch (err) {
        console.error("Failed to load user profile", err);
        setUser({
          uid: fbUser.uid,
          email: fbUser.email ?? "",
          name: fbUser.displayName ?? "",
          role: "student",
        });
      } finally {
        setLoading(false);
      }
    });
  }, []);

  return useMemo<AuthCtx>(
    () => ({
      user,
      loading,
      mode: "firebase",
      async login(email, password) {
        try {
          await signInWithEmail(email, password);
        } catch (err) {
          throw new Error(describeAuthError(err), { cause: err });
        }
        // Resolve the profile now so callers can redirect by role.
        const profile = await getUserProfile(auth!.currentUser!);
        const u: AuthUser = {
          uid: profile.uid,
          email: profile.email,
          name: profile.name,
          role: profile.role,
        };
        setUser(u);
        return u;
      },
      async signupStudent(name, email, password) {
        try {
          const profile = await signUpWithEmail(email, password, name);
          const u: AuthUser = {
            uid: profile.uid,
            email: profile.email,
            name: profile.name,
            role: profile.role,
          };
          setUser(u);
          return u;
        } catch (err) {
          throw new Error(describeAuthError(err), { cause: err });
        }
      },
      async logout() {
        await signOutUser();
        setUser(null);
      },
    }),
    [user, loading],
  );
}

// The backend is fixed at build time, so choosing the hook here is stable.
const useAuthBackend = isFirebaseConfigured ? useFirebaseAuth : useDemoAuth;

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useAuthBackend();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
