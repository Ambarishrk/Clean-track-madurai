'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient();

/**
 * A sub-component to sync the Firebase user state from the Provider hook
 * to the Zustand auth store used throughout the app for backward compatibility.
 */
function AuthStoreSync() {
  const { user, isUserLoading } = useUser();
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    setUser(user);
    setLoading(isUserLoading);
  }, [user, isUserLoading, setUser, setLoading]);

  return null;
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthStoreSync />
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}
