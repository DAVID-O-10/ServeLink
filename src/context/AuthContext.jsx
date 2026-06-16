import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import {
  getSession,
  setSession,
  registerUser as registerLocal,
  loginUser as loginLocal,
} from '../lib/storage';
import { useRecaptcha } from '../hooks/useRecaptcha';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSession());
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const { getToken } = useRecaptcha();

  useEffect(() => {
    const sync = () => setUser(getSession());
    window.addEventListener('servelink-auth', sync);
    return () => window.removeEventListener('servelink-auth', sync);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSession({
          userId: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name ?? session.user.email,
          supabase: true,
        });
        setUser(getSession());
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSession({
          userId: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name ?? session.user.email,
          supabase: true,
        });
      } else if (getSession()?.supabase) {
        setSession(null);
      }
      setUser(getSession());
    });

    return () => subscription.unsubscribe();
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    if (isSupabaseConfigured) {
      const captchaToken = await getToken();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name }, captchaToken },
      });
      if (error) throw error;
      if (data.user) {
        setSession({
          userId: data.user.id,
          email: data.user.email,
          name,
          supabase: true,
        });
        setUser(getSession());
      }
      return data.user;
    }
    const u = registerLocal({ name, email, password });
    setUser(getSession());
    return u;
  }, [getToken]);

  const login = useCallback(async (email, password) => {
    if (isSupabaseConfigured) {
      const captchaToken = await getToken();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password, options: { captchaToken } });
      if (error) throw error;
      setUser(getSession());
      return data.user;
    }
    loginLocal(email, password);
    setUser(getSession());
    return getSession();
  }, [getToken]);

  const signInWithGoogle = useCallback(async () => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured');
    }
    const captchaToken = await getToken();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        captchaToken,
      },
    });
    if (error) throw error;
  }, [getToken]);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, signInWithGoogle, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
