'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  logout: () => void;
  loading: boolean; // We expose this for components that might need it
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to fetch user profile
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

// AuthProvider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // This effect runs ONCE on component mount to get the initial session
    // and set up the listener for future changes.
    const initializeSession = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      
      if (initialSession) {
        setSession(initialSession);
        try {
            const profile = await fetchUserProfile(initialSession.user.id, initialSession.user.email);
            setUser({ name: profile.name, role: profile.role as User['role'] });
        } catch (e) {
            console.error("AuthContext: Failed to fetch profile on initial load.", e);
            setUser(null); // Clear user state on error
        }
      }
      setLoading(false);
    };

    initializeSession();

    // Set up the listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          try {
            const profile = await fetchUserProfile(currentSession.user.id, currentSession.user.email);
            setUser({ name: profile.name, role: profile.role as User['role'] });

            // Only redirect immediately after a successful sign-in
            if (event === 'SIGNED_IN') {
              if (profile.role === 'admin') router.push('/dashboard/admin');
              else if (profile.role === 'owner') router.push('/dashboard/owner');
              else router.push('/');
            }
          } catch (e) {
             console.error("AuthContext: Failed to fetch profile on auth change.", e);
             setUser(null);
          }
        } else {
          // User is logged out
          setUser(null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]); // router is stable and won't cause re-runs.

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/login'); // Manually redirect on logout
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