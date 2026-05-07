import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { authApi } from '@/lib/api/endpoints';
import { ApiError, registerUnauthorizedHandler } from '@/lib/api/client';
import type { MeResponse } from '@/lib/api/types';
import type { I18nKey } from '@/i18n/translations';

import { authStorage } from './storage';

type AuthStatus = 'booting' | 'signedOut' | 'signedIn';

interface AuthContextValue {
  status: AuthStatus;
  user: MeResponse | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('booting');
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<MeResponse | null>(null);

  const logout = async () => {
    await authStorage.clearToken();
    setToken(null);
    setUser(null);
    setStatus('signedOut');
  };

  useEffect(() => {
    registerUnauthorizedHandler(async () => {
      await logout();
    });
  }, []);

  useEffect(() => {
    (async () => {
      const storedToken = await authStorage.getToken();
      if (!storedToken) {
        setStatus('signedOut');
        return;
      }

      setToken(storedToken);
      try {
        const me = await authApi.me();
        setUser(me);
        setStatus('signedIn');
      } catch {
        await authStorage.clearToken();
        setToken(null);
        setUser(null);
        setStatus('signedOut');
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    await authStorage.setToken(res.token);
    setToken(res.token);

    try {
      const me = await authApi.me();
      setUser(me);
      setStatus('signedIn');
    } catch (error) {
      await authStorage.clearToken();
      setToken(null);
      setUser(null);
      setStatus('signedOut');
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      status,
      user,
      token,
      login,
      logout,
    }),
    [status, user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export function getFriendlyLoginError(error: unknown): I18nKey {
  if (error instanceof ApiError && error.status === 401) return 'auth.invalid';
  return 'common.error';
}


