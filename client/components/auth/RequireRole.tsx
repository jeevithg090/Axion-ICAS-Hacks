import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/context/AuthContext";

export default function RequireRole({ role, children }: { role: Role; children: JSX.Element }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(loc.pathname)}`} replace />;
  if (user.role !== role) return <Navigate to={user.role === "admin" ? "/admin" : "/portal"} replace />;
  return children;
}
