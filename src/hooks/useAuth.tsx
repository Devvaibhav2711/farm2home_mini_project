import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  full_name: string;
  role: string;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  address?: string | null;
  zip_code?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: { message: string } | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: { message: string } | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load profile in background - don't block
  const loadProfile = async (userId: string, email: string, fullName?: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profile) {
        setUser({
          _id: profile.id,
          id: profile.id,
          name: profile.full_name || email,
          email: profile.email,
          full_name: profile.full_name || email,
          role: profile.role || 'customer',
          phone: profile.phone,
          city: profile.city,
          state: profile.state,
          address: profile.address,
          zip_code: profile.zip_code,
        });
        setIsAdmin(profile.role === 'admin');
      }
    } catch (e) {
      console.log('Profile load skipped');
    }
  };

  useEffect(() => {
    // Safety timeout - never let loading state hang forever
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    // Quick session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(timeout);
      if (session?.user) {
        // Set basic user immediately
        setUser({
          _id: session.user.id,
          id: session.user.id,
          name: session.user.email || 'User',
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || session.user.email || 'User',
          role: 'customer',
        });
        // Load full profile in background
        loadProfile(session.user.id, session.user.email || '');
      }
      setLoading(false);
    }).catch(() => {
      clearTimeout(timeout);
      setLoading(false);
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser({
          _id: session.user.id,
          id: session.user.id,
          name: session.user.email || 'User',
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || session.user.email || 'User',
          role: 'customer',
        });
        loadProfile(session.user.id, session.user.email || '');
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { error: { message: error.message } };
    }

    if (data.user) {
      // Set user immediately - don't wait for profile
      setUser({
        _id: data.user.id,
        id: data.user.id,
        name: email,
        email: email,
        full_name: data.user.user_metadata?.full_name || email,
        role: 'customer',
      });
      // Load profile in background
      loadProfile(data.user.id, email);
    }

    return { error: null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) {
      return { error: { message: error.message } };
    }

    if (data.user) {
      // Create profile
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: email,
        full_name: fullName,
        role: 'customer'
      }).select().single();

      setUser({
        _id: data.user.id,
        id: data.user.id,
        name: fullName,
        email: email,
        full_name: fullName,
        role: 'customer',
      });
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
