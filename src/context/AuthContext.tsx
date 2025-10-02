'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchUserProfile(userId: string, userEmail?: string): Promise<{ role: string; name: string; }> {
    const { data, error } = await supabase
        .from('profiles')
        .select('role, username')
        .eq('id', userId)
        .single();
        
    const emailUsername = userEmail?.split('@')[0] || 'User';

    if (error || !data) {
        console.error('AuthContext: Error fetching user profile. Using fallback.', error);
        return { role: 'user', name: emailUsername };
    }

    return { role: data.role, name: data.username || emailUsername };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeSession = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      
      if (initialSession) {
        setSession(initialSession);
        try {
            const profile = await fetchUserProfile(initialSession.user.id, initialSession.user.email);
            setUser({ name: profile.name, role: profile.role as User['role'] });
        } catch (e) {
            console.error("AuthContext: Failed to fetch profile on initial load.", e);
            setUser(null);
        }
      }
      setLoading(false);
    };

    initializeSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        // On SIGNED_OUT, redirect immediately
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          window.location.href = '/login';
          return;
        }

        if (currentSession?.user) {
          try {
            const profile = await fetchUserProfile(currentSession.user.id, currentSession.user.email);
            setUser({ name: profile.name, role: profile.role as User['role'] });

            if (event === 'SIGNED_IN') {
              router.push('/');
            }
          } catch (e) {
             console.error("AuthContext: Failed to fetch profile on auth change.", e);
             setUser(null);
          }
        } else {
          setUser(null);
          setSession(null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  const logout = async () => {
    await supabase.auth.signOut();
    // The onAuthStateChange listener will handle the redirect and state clearing.
    // As a fallback for any race conditions, we'll force it.
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, session, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}