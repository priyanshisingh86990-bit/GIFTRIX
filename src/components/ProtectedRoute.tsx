import { useEffect } from "react";
import { useLocation } from "wouter";
import { isLoggedIn } from "@/lib/auth";

interface ProtectedRouteProps {
  component: React.ComponentType;
}

export default function ProtectedRoute({ component: Component }: ProtectedRouteProps) {
  const [, navigate] = useLocation();

  useEffect(()=>{
    if (!isLoggedIn()){
      navigate("/login");
    }
  }, [navigate]);
  if (!isLoggedIn()){
    return null;
  }

  return <Component />;
}
