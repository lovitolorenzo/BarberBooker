import { useState, useEffect } from 'react';

interface AuthState {
  isLoggedIn: boolean;
  userRole: string | null;
  userEmail: string | null;
  userFirstName: string | null;
  userLastName: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    userRole: null,
    userEmail: null,
    userFirstName: null,
    userLastName: null,
  });

  // Check authentication status on mount and storage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const userRole = localStorage.getItem('userRole');
      const userEmail = localStorage.getItem('userEmail');
      const userFirstName = localStorage.getItem('userFirstName');
      const userLastName = localStorage.getItem('userLastName');
      
      setAuthState({
        isLoggedIn: !!(userRole && userEmail),
        userRole,
        userEmail,
        userFirstName,
        userLastName,
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
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
    
    setAuthState({
      isLoggedIn: false,
      userRole: null,
      userEmail: null,
      userFirstName: null,
      userLastName: null,
    });

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('auth-change'));
  };

  return {
    ...authState,
    logout,
  };
}
