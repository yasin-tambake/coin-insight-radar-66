
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name?: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  register: (email: string, password: string, name?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('cryptoUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const register = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would make an API call to a backend
      // For this example, we'll simulate registration
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 15),
        email,
        name
      };
      
      // Save to localStorage (simulating persistence)
      localStorage.setItem('cryptoUser', JSON.stringify(newUser));
      setUser(newUser);
      
      toast.success('Account created successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would validate credentials with a backend
      // For this example, we'll simulate login
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 15),
        email,
      };
      
      localStorage.setItem('cryptoUser', JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast.success('Logged in successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Remove user data from localStorage
      localStorage.removeItem('cryptoUser');
      setUser(null);
      
      toast.success('Logged out successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would trigger a password reset email
      // For this example, we'll simulate the process
      toast.success(`Password reset link sent to ${email}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password reset failed';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update user data
      if (user) {
        const updatedUser = { ...user, ...userData };
        localStorage.setItem('cryptoUser', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        toast.success('Profile updated successfully!');
      } else {
        throw new Error('User not authenticated');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Profile update failed';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        register,
        login,
        logout,
        resetPassword,
        updateProfile,
      }}
    >
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
