import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Droplet, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const success = await login(email, password);
        if (success) {
          toast({
            title: "Welcome back!",
            description: "Successfully logged in.",
          });
          navigate('/');
        } else {
          toast({
            title: "Error",
            description: "Invalid email or password.",
            variant: "destructive",
          });
        }
      } else {
        const success = await signup(email, password);
        if (success) {
          toast({
            title: "Account created!",
            description: "Successfully signed up.",
          });
          navigate('/');
        } else {
          toast({
            title: "Error",
            description: "Email already exists.",
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-info/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Modern Blood Bank System</span>
          </div>
          
          <h1 className="text-5xl xl:text-6xl font-bold leading-tight">
            Welcome to
            <span className="block bg-gradient-to-r from-primary via-primary/80 to-info bg-clip-text text-transparent">
              LifeFlow
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-md">
            Manage blood donations efficiently with our modern, secure platform. Every drop counts, every life matters.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Droplet className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Real-time Tracking</p>
                <p className="text-sm text-muted-foreground">Monitor inventory and donations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="font-semibold">Secure & Reliable</p>
                <p className="text-sm text-muted-foreground">Your data is protected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full">
          <Card className="border-border/50 shadow-2xl">
            <CardHeader className="space-y-4 pb-8">
              {/* Logo for mobile */}
              <div className="lg:hidden flex items-center gap-3 justify-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-info flex items-center justify-center shadow-lg">
                  <Droplet className="w-6 h-6 text-white" fill="currentColor" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">LifeFlow</h2>
                  <p className="text-xs text-muted-foreground">Blood Bank System</p>
                </div>
              </div>

              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold">
                  {isLogin ? 'Welcome back' : 'Create account'}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {isLogin ? 'Enter your credentials to continue' : 'Sign up to get started'}
                </p>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-border/50 focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12 border-border/50 focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-info hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <span className="font-semibold text-primary hover:underline">
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </span>
                </button>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

// Add Card components if not imported
import { Card, CardContent, CardHeader } from "@/components/ui/card";
