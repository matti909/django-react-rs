import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { getUser } from "~/lib/auth";

export default function ProtectedRoute() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const user = getUser();
  return user ? <Outlet /> : <Navigate to="/login" />;
}
