/**
 * Pure helpers for the local demo-mode user store (used when Firebase is not
 * configured). Demo mode keeps accounts in localStorage and is intended for
 * local evaluation only: it provides no real security.
 */

export type Role = "student" | "professor" | "admin";

export interface AuthUser {
  /** Firebase UID; absent in demo mode. */
  uid?: string;
  email: string;
  name: string;
  role: Role;
}

export interface StoredUser extends AuthUser {
  password: string;
}

const ROLES: readonly Role[] = ["student", "professor", "admin"];

export function normalizeRole(role: unknown): Role {
  if (role === "faculty") return "professor";
  return ROLES.includes(role as Role) ? (role as Role) : "student";
}

export function toPublicUser(u: StoredUser): AuthUser {
  return { email: u.email, name: u.name, role: u.role };
}

export function findUser(
  users: StoredUser[],
  email: string,
  password: string,
): AuthUser | null {
  const needle = email.trim().toLowerCase();
  const match = users.find(
    (u) => u.email.toLowerCase() === needle && u.password === password,
  );
  return match ? toPublicUser(match) : null;
}

export function addStudent(
  users: StoredUser[],
  input: { name: string; email: string; password: string },
): { users: StoredUser[]; user: AuthUser } {
  const name = input.name.trim();
  const email = input.email.trim();
  if (!name) throw new Error("Name is required");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please enter a valid email address");
  }
  if (input.password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("Email already registered");
  }
  const stored: StoredUser = {
    name,
    email,
    password: input.password,
    role: "student",
  };
  return { users: [...users, stored], user: toPublicUser(stored) };
}

/** Where a user lands after signing in. */
export function homeFor(role: Role): string {
  return role === "admin" ? "/admin" : "/portal";
}

/**
 * Validates a post-login redirect target taken from the URL. Only same-origin
 * absolute paths are allowed, which prevents open redirects such as
 * `?next=https://evil.example` or `?next=//evil.example`.
 */
export function safeRedirect(
  next: string | null | undefined,
  fallback: string,
): string {
  if (!next) return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return fallback;
  }
  // Reject control characters (e.g. tab/newline tricks).
  if ([...next].some((c) => c.charCodeAt(0) < 0x20)) return fallback;
  return next;
}
