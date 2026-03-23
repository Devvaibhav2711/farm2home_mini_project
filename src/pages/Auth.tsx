import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Leaf, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from state or default to home
  const from = (location.state as any)?.from || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, from]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message?.includes('Invalid login credentials')) {
          toast.error('Invalid email or password');
        } else {
          toast.error(error.message || 'Login failed');
        }
      } else {
        toast.success('Welcome back!');
        navigate(from, { replace: true });
      }
    } else {
      if (!fullName.trim()) {
        toast.error('Please enter your full name');
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, fullName);
      if (error) {
        if (error.message?.includes('already registered')) {
          toast.error('This email is already registered. Please sign in.');
        } else {
          toast.error(error.message || 'Signup failed');
        }
      } else {
        toast.success('Account created successfully!');
        navigate(from, { replace: true });
      }
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="bg-card rounded-2xl shadow-hover p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-primary rounded-full p-3 mb-4">
              <Leaf className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p className="text-muted-foreground mt-2">
              {isLogin ? 'Sign in to your FreshFarm account' : 'Join FreshFarm for fresh deliveries'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="pl-10"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-muted-foreground mt-1">Must be at least 6 characters</p>
              )}
            </div>

            <Button type="submit" className="w-full btn-hero group" size="lg" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                  Please wait...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline text-sm font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
            
            {from !== '/' && (
              <p className="text-xs text-muted-foreground">
                You'll be redirected back after signing in
              </p>
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to FreshFarm's Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
