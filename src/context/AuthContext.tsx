"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { User, Session } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  avatar_url: string | null;
  role: "customer" | "admin";
  active?: boolean;
  created_at: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, pass: string, fullName: string, phone: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const userObj = (await supabase.auth.getUser()).data.user;
      const isMasterEmail = userObj?.email === "saverabygourii@gmail.com";

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (data) {
        if (isMasterEmail && data.role !== "admin") {
          // Attempt RLS upsert for admin role
          supabase
            .from("profiles")
            .upsert({ id: userId, full_name: "Gouri", role: "admin", active: true })
            .then();

          setProfile({ ...data, role: "admin" } as Profile);
        } else {
          setProfile(data as Profile);
        }
      } else {
        // Fallback profile if DB row missing or RLS blocked
        const fallbackProfile: Profile = {
          id: userId,
          full_name: userObj?.user_metadata?.full_name || (isMasterEmail ? "Gouri" : "Customer"),
          phone_number: userObj?.user_metadata?.phone_number || null,
          avatar_url: null,
          role: isMasterEmail ? "admin" : "customer",
          active: true,
          created_at: new Date().toISOString(),
        };

        // Try background upsert
        supabase.from("profiles").upsert(fallbackProfile).then();
        setProfile(fallbackProfile);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function refreshProfile() {
    if (user) {
      await fetchProfile(user.id);
    }
  }

  const signInWithEmail = async (email: string, pass: string) => {
    const res = await supabase.auth.signInWithPassword({ email, password: pass });
    return { error: res.error };
  };

  const signUpWithEmail = async (email: string, pass: string, fullName: string, phone: string) => {
    const res = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: fullName,
          phone_number: phone,
        },
      },
    });

    if (!res.error && res.data.user) {
      await supabase.from("profiles").upsert({
        id: res.data.user.id,
        full_name: fullName,
        phone_number: phone,
        role: "customer",
        active: true,
      });
    }

    return { error: res.error };
  };

  const signInWithGoogle = async () => {
    const res = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/account` : undefined,
      },
    });
    return { error: res.error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const isAdmin = profile?.role === "admin" || user?.email === "saverabygourii@gmail.com";

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isAdmin,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
