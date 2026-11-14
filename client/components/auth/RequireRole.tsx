import type { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, type Role } from "@/context/AuthContext";
import { homeFor } from "@/lib/auth-users";
import AuthLoading from "./AuthLoading";

/** Renders children only for users with the given role. */
export default function RequireRole({
  role,
  children,
}: {
  role: Role;
  children: ReactElement;
}) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <AuthLoading />;
  if (!user) {
    const next = encodeURIComponent(loc.pathname + loc.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  if (user.role !== role) return <Navigate to={homeFor(user.role)} replace />;
  return children;
}
