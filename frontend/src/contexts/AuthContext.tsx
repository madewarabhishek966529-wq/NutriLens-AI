import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, signInWithGoogle, signOut as supabaseSignOut } from "@/services/supabaseClient";
import { apiClient } from "@/services/apiClient";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      if (data.session) syncProfile();
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (event === "SIGNED_IN") syncProfile();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function syncProfile() {
    try {
      await apiClient.post("/api/auth/sync");
    } catch {
      // Non-fatal — profile page will still work, just without a pre-warmed row
    }
  }

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    loading,
    signIn: signInWithGoogle,
    signOut: supabaseSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
