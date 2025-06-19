import { useState, useEffect } from 'react';

interface AuthState {
  isLoggedIn: boolean;
  userRole: string | null;
  userEmail: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    userRole: null,
    userEmail: null,
  });

  // Check authentication status on mount and storage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const userRole = localStorage.getItem('userRole');
      const userEmail = localStorage.getItem('userEmail');
      
      setAuthState({
        isLoggedIn: !!(userRole && userEmail),
        userRole,
        userEmail,
      });
    };

    // Check initial status
    checkAuthStatus();

    // Listen for storage changes (including from other tabs)
    window.addEventListener('storage', checkAuthStatus);
    
    // Custom event for logout
    window.addEventListener('auth-change', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('auth-change', checkAuthStatus);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    
    setAuthState({
      isLoggedIn: false,
      userRole: null,
      userEmail: null,
    });

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('auth-change'));
  };

  return {
    ...authState,
    logout,
  };
}
