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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Updated function to fetch both role and username from the 'profiles' table
async function fetchUserProfile(userId: string): Promise<{ role: string; name: string; }> {
    const { data, error } = await supabase
        .from('profiles')
        .select('role, username') // Select both columns
        .eq('id', userId)
        .single();
        
    // Get user object from auth to use as a fallback
    const { data: { user } } = await supabase.auth.getUser();
    const emailUsername = user?.email?.split('@')[0] || 'User';

    if (error || !data) {
        console.error('Error fetching user profile, using fallback:', error);
        return { role: 'user', name: emailUsername };
    }

    // Use the username from the profile, OR the email part, OR a generic 'User'
    const displayName = data.username || emailUsername;

    return { role: data.role, name: displayName };
}


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session?.user) {
        const { role, name } = await fetchUserProfile(session.user.id);
        setUser({ name, role: role as User['role'] });
      }
      setLoading(false);
    };

    getSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (event === 'SIGNED_IN' && session?.user) {
           const { role, name } = await fetchUserProfile(session.user.id);
           setUser({ name, role: role as User['role'] });
           
           if (role === 'admin') {
               router.push('/dashboard/admin');
           } else if (role === 'owner') {
               router.push('/dashboard/owner');
           } else {
               router.push('/');
           }
        }
        if (event === 'SIGNED_OUT') {
          setUser(null);
          router.push('/login');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    router.push('/login');
  };

  if (loading) {
      return null; // You could render a full-page loader component here for a better UX
  }
  
  return (
    <AuthContext.Provider value={{ user, session, logout }}>
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

