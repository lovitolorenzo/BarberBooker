import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '@/config/api';

interface AuthState {
  isLoggedIn: boolean;
  userRole: string | null;
  userEmail: string | null;
  userFirstName: string | null;
  userLastName: string | null;
  userPhone: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    userRole: null,
    userEmail: null,
    userFirstName: null,
    userLastName: null,
    userPhone: null,
  });

  // Check authentication status on mount and storage changes
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await apiGet('/auth/me');

        if (!response.ok) {
          throw new Error('Not authenticated');
        }

        const data = await response.json();
        const user = data?.user;

        setAuthState({
          isLoggedIn: !!user,
          userRole: user?.role || null,
          userEmail: user?.email || null,
          userFirstName: user?.firstName || null,
          userLastName: user?.lastName || null,
          userPhone: user?.phone || null,
        });
      } catch {
        setAuthState({
          isLoggedIn: false,
          userRole: null,
          userEmail: null,
          userFirstName: null,
          userLastName: null,
          userPhone: null,
        });
      }
    };

    // Check initial status
    void checkAuthStatus();

    const handleAuthChange = () => {
      void checkAuthStatus();
    };

    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const logout = async () => {
    try {
      await apiPost('/auth/logout');
    } catch {
      // ignore
    }

    setAuthState({
      isLoggedIn: false,
      userRole: null,
      userEmail: null,
      userFirstName: null,
      userLastName: null,
      userPhone: null,
    });

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('auth-change'));
  };

  return {
    ...authState,
    logout,
  };
}
