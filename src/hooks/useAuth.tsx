import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  full_name: string;
  role: string;
  phone?: string;
  city?: string;
  state?: string;
  address?: string;
  zip_code?: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const createUserData = (profile: any): User => ({
    _id: profile.id,
    id: profile.id,
    name: profile.full_name,
    email: profile.email,
    full_name: profile.full_name,
    role: profile.role || 'customer',
    phone: profile.phone || undefined,
    city: profile.city || undefined,
    state: profile.state || undefined,
    address: profile.address || undefined,
    zip_code: profile.zip_code || undefined,
  });

  const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<boolean> => {
    try {
      // Try to get existing profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (profile) {
        setUser(createUserData(profile));
        setIsAdmin(profile.role === 'admin');
        return true;
      }

      // Profile doesn't exist, create it
      if (error?.code === 'PGRST116' || !profile) {
        const newProfileData = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          full_name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
          role: 'customer'
        };

        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert(newProfileData)
          .select()
          .single();

        if (!insertError && newProfile) {
          setUser(createUserData(newProfile));
          setIsAdmin(false);
          return true;
        }

        // If insert fails (maybe trigger already created it), try fetching again
        if (insertError) {
          const { data: retryProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', supabaseUser.id)
            .single();

          if (retryProfile) {
            setUser(createUserData(retryProfile));
            setIsAdmin(retryProfile.role === 'admin');
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user && mounted) {
          await fetchUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          setLoading(true);
          await fetchUserProfile(session.user);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAdmin(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        return { error: { message: error.message } };
      }

      if (data.user) {
        await fetchUserProfile(data.user);
      }

      setLoading(false);
      return { error: null };
    } catch (error: any) {
      setLoading(false);
      return { error: { message: error.message || 'Sign in failed' } };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) {
        setLoading(false);
        return { error: { message: error.message } };
      }

      if (data.user) {
        // Profile will be created by trigger or we create it
        await fetchUserProfile(data.user);
      }

      setLoading(false);
      return { error: null };
    } catch (error: any) {
      setLoading(false);
      return { error: { message: error.message || 'Sign up failed' } };
    }
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
