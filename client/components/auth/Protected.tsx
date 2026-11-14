import type { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AuthLoading from "./AuthLoading";

/** Renders children only for signed-in users; otherwise redirects to /login. */
export default function Protected({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <AuthLoading />;
  if (!user) {
    const next = encodeURIComponent(loc.pathname + loc.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return children;
}
