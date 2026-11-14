import { describe, expect, it } from "vitest";
import {
  addStudent,
  findUser,
  homeFor,
  normalizeRole,
  safeRedirect,
  type StoredUser,
} from "./auth-users";

const users: StoredUser[] = [
  {
    email: "student@icas.edu",
    password: "icas123",
    name: "Student",
    role: "student",
  },
  {
    email: "admin@icas.edu",
    password: "secret1",
    name: "Admin",
    role: "admin",
  },
];

describe("safeRedirect", () => {
  it("allows same-origin absolute paths", () => {
    expect(safeRedirect("/portal/transfer?tab=docs", "/portal")).toBe(
      "/portal/transfer?tab=docs",
    );
  });

  it.each([
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "javascript:alert(1)",
    "portal",
    "/portal\nSet-Cookie:x",
  ])("rejects unsafe target %j", (next) => {
    expect(safeRedirect(next, "/portal")).toBe("/portal");
  });

  it("uses the fallback when next is missing", () => {
    expect(safeRedirect(null, "/admin")).toBe("/admin");
    expect(safeRedirect("", "/admin")).toBe("/admin");
  });
});

describe("findUser", () => {
  it("matches email case-insensitively and strips the password", () => {
    const u = findUser(users, "  STUDENT@icas.edu ", "icas123");
    expect(u).toEqual({
      email: "student@icas.edu",
      name: "Student",
      role: "student",
    });
    expect(u).not.toHaveProperty("password");
  });

  it("rejects a wrong password", () => {
    expect(findUser(users, "admin@icas.edu", "icas123")).toBeNull();
  });
});

describe("addStudent", () => {
  it("creates a student account without mutating the input", () => {
    const { users: next, user } = addStudent(users, {
      name: " New Student ",
      email: "new@icas.edu",
      password: "hunter22",
    });
    expect(user).toEqual({
      email: "new@icas.edu",
      name: "New Student",
      role: "student",
    });
    expect(next).toHaveLength(users.length + 1);
    expect(users).toHaveLength(2);
  });

  it("always assigns the student role", () => {
    const { user } = addStudent([], {
      name: "Eve",
      email: "eve@icas.edu",
      password: "123456",
    });
    expect(user.role).toBe("student");
  });

  it.each([
    [{ name: "", email: "a@b.co", password: "123456" }, /name is required/i],
    [{ name: "A", email: "not-an-email", password: "123456" }, /valid email/i],
    [{ name: "A", email: "a@b.co", password: "123" }, /at least 6/i],
    [
      { name: "A", email: "Student@ICAS.edu", password: "123456" },
      /already registered/i,
    ],
  ])("rejects invalid input %#", (input, message) => {
    expect(() => addStudent(users, input)).toThrow(message);
  });
});

describe("roles", () => {
  it("normalizes legacy and unknown roles", () => {
    expect(normalizeRole("faculty")).toBe("professor");
    expect(normalizeRole("admin")).toBe("admin");
    expect(normalizeRole("superuser")).toBe("student");
    expect(normalizeRole(undefined)).toBe("student");
  });

  it("routes admins to the admin dashboard", () => {
    expect(homeFor("admin")).toBe("/admin");
    expect(homeFor("student")).toBe("/portal");
    expect(homeFor("professor")).toBe("/portal");
  });
});
