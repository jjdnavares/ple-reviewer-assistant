"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authApi, userApi } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
  uploadProfileImage: (formData: FormData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check for logged in user on initial load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await userApi.getCurrentUser();
        if (data && data.status === 'success') {
          setUser(data.data);
        }
      } catch (error) {
        console.error('Not authenticated');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      if (data && data.status === 'success') {
        setUser(data.data.user);
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const data = await authApi.register(name, email, password);
      if (data && data.status === 'success') {
        setUser(data.data);
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (data: { name?: string; email?: string }) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await userApi.updateProfile(user.id, data);
      if (response && response.status === 'success') {
        setUser({ ...user, ...data });
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Upload profile image function
  const uploadProfileImage = async (formData: FormData) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await userApi.uploadProfileImage(user.id, formData);
      if (response && response.status === 'success' && response.data?.image) {
        setUser({ ...user, image: response.data.image });
      }
    } catch (error) {
      console.error('Profile image upload failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      uploadProfileImage
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
