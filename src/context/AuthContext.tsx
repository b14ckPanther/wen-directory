'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// --- Define the possible roles and subscription plans ---
type UserRole = 'admin' | 'owner' | 'user';
type SubscriptionPlan = 'أساسي' | 'مميز' | 'ذهبي' | null;

// --- Updated User type to include subscription details ---
type User = {
  name: string;
  role: UserRole;
  subscription?: SubscriptionPlan; // e.g., 'أساسي', 'مميز', 'ذهبي'
  businessType?: 'products' | 'services'; // To know what to show in their dashboard
};

type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = (userData: User) => {
    setUser(userData);
    // Redirect users based on their role
    if (userData.role === 'admin') {
      router.push('/dashboard/admin');
    } else if (userData.role === 'owner') {
        router.push('/dashboard/owner');
    } else {
      router.push('/');
    }
  };

  const logout = () => {
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to easily access the context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}