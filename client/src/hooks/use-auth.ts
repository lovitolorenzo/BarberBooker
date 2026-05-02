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

type AuthUserPayload = {
  role?: string | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
};

const AUTH_STORAGE_KEY = 'barberbooker_auth_user';

const emptyAuthState: AuthState = {
  isLoggedIn: false,
  userRole: null,
  userEmail: null,
  userFirstName: null,
  userLastName: null,
  userPhone: null,
};

const mapUserToAuthState = (user?: AuthUserPayload | null): AuthState => ({
  isLoggedIn: !!user,
  userRole: user?.role || null,
  userEmail: user?.email || null,
  userFirstName: user?.firstName || null,
  userLastName: user?.lastName || null,
  userPhone: user?.phone || null,
});

const loadPersistedAuthState = (): AuthState => {
  if (typeof window === 'undefined') {
    return emptyAuthState;
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return emptyAuthState;
    }

    const user = JSON.parse(raw) as AuthUserPayload;
    return mapUserToAuthState(user);
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return emptyAuthState;
  }
};

export const persistAuthUser = (user?: AuthUserPayload | null) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (!user) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
    role: user.role || null,
    email: user.email || null,
    firstName: user.firstName || null,
    lastName: user.lastName || null,
    phone: user.phone || null,
  }));
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => loadPersistedAuthState());

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
        const nextState = mapUserToAuthState(user);

        persistAuthUser(user);
        setAuthState(nextState);
      } catch {
        setAuthState(loadPersistedAuthState());
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

    persistAuthUser(null);
    setAuthState(emptyAuthState);

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('auth-change'));
  };

  return {
    ...authState,
    logout,
  };
}
