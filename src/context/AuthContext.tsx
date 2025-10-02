'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useRef } from 'react';
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
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  // ✅ FIX: Force a full page reload on logout to clear all stale state.
  const logout = useCallback(async () => {
    console.log('Force logging out...');
    await supabase.auth.signOut().catch(error => {
      // We catch the "Auth session missing!" error but proceed anyway,
      // as the goal is to reset the client state.
      console.warn('Supabase signOut error (ignoring):', error.message);
    });
    
    // This is a more forceful redirect that clears all application state.
    window.location.assign('/');
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    inactivityTimer.current = setTimeout(() => {
        if (user?.role === 'admin') {
            console.log('Admin inactivity timer triggered. Logging out.');
            logout();
        }
    }, 5 * 60 * 1000); // 5 minutes
  }, [logout, user]);

  useEffect(() => {
    if (user?.role === 'admin') {
      const events: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'scroll', 'click'];
      const resetTimer = () => resetInactivityTimer();

      events.forEach(event => window.addEventListener(event, resetTimer));
      resetInactivityTimer();

      return () => {
        events.forEach(event => window.removeEventListener(event, resetTimer));
        if (inactivityTimer.current) {
          clearTimeout(inactivityTimer.current);
        }
      };
    }
  }, [user, resetInactivityTimer]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        if (currentSession?.user) {
          const profile = await fetchUserProfile(currentSession.user.id, currentSession.user.email);
          setUser({ name: profile.name, role: profile.role as User['role'] });
          setSession(currentSession);
        } else {
          setUser(null);
          setSession(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);


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