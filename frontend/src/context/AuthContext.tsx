import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { apiFetch, authTokenKey } from '../lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'CUSTOMER';
  companyId: string | null;
}

interface AuthContextType {
  user: User | null;
  authLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: User['role']) => Promise<LoginResult>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<SignupResult>;
  logout: () => void;
}

export type LoginResult =
  | { success: true; user: User }
  | { success: false; reason: 'INVALID_CREDENTIALS' | 'PROFILE_UNAVAILABLE' | 'WRONG_ROLE' };

export type SignupResult =
  | { success: true }
  | { success: false; message: string };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem(authTokenKey)) {
      setAuthLoading(false);
      return;
    }
    void apiFetch<User>('/api/auth/me').then(setUser).catch(() => {
      localStorage.removeItem(authTokenKey);
      setUser(null);
    }).finally(() => setAuthLoading(false));
  }, []);

  const login = async (email: string, password: string, _requestedRole?: User['role']): Promise<LoginResult> => {
    void _requestedRole; // Login role comes from the verified backend response.
    try {
      const result = await apiFetch<{ token: string; user: User }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      localStorage.setItem(authTokenKey, result.token);
      setUser(result.user);
      return { success: true, user: result.user };
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (message.includes('not configured')) return { success: false, reason: 'WRONG_ROLE' };
      return { success: false, reason: 'INVALID_CREDENTIALS' };
    }
  };

  const signup = async (name: string, email: string, phone: string, password: string): Promise<SignupResult> => {
    try {
      await apiFetch('/api/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, phone, password }) });
      return { success: true };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'The account could not be created.' };
    }
  };

  const logout = () => {
    localStorage.removeItem(authTokenKey);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      authLoading,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
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
