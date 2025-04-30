
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import AuthComponent from '@/components/Auth';
import { useAuth } from '@/hooks/useAuth';

const Auth = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <Layout>
      <div className="flex justify-center my-8">
        <div className="w-full max-w-md">
          <AuthComponent />
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
