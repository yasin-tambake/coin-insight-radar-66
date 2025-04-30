
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Auth = () => {
  const navigate = useNavigate();
  const { register, login, resetPassword, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password || !confirmPassword || !name) {
      setError('Please fill all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      await register(email, password, name);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    try {
      await resetPassword(email);
      setAuthMode('login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-md bg-crypto-dark border-gray-800">
        <CardHeader>
          <CardTitle>Welcome to CoinInsightRadar</CardTitle>
          <CardDescription>
            {authMode === 'login'
              ? 'Sign in to your account to continue'
              : authMode === 'register'
              ? 'Create a new account to get started'
              : 'Reset your password via email'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {authMode === 'login' || authMode === 'register' ? (
            <Tabs
              value={authMode}
              onValueChange={(value) => setAuthMode(value as 'login' | 'register')}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="bg-crypto-dark border-gray-700"
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="password">Password</Label>
                      <button
                        type="button"
                        className="text-xs text-blue-400 hover:text-blue-300"
                        onClick={() => setAuthMode('reset')}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="bg-crypto-dark border-gray-700"
                      autoComplete="current-password"
                    />
                  </div>
                  
                  {error && (
                    <div className="text-sm text-crypto-down mt-2">{error}</div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="bg-crypto-dark border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="bg-crypto-dark border-gray-700"
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="bg-crypto-dark border-gray-700"
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirm Password</Label>
                    <Input
                      id="register-confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="bg-crypto-dark border-gray-700"
                      autoComplete="new-password"
                    />
                  </div>
                  
                  {error && (
                    <div className="text-sm text-crypto-down mt-2">{error}</div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-crypto-dark border-gray-700"
                />
              </div>
              
              {error && (
                <div className="text-sm text-crypto-down mt-2">{error}</div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => setAuthMode('login')} 
                  variant="outline" 
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleResetPassword} 
                  className="flex-1" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Reset Password'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center border-t border-gray-800 pt-4">
          <p className="text-xs text-gray-400">
            By using this service, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
