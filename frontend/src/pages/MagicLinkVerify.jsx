import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function MagicLinkVerify() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const { loginWithMagicLink } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      setError('Invalid magic link');
      return;
    }

    const verify = async () => {
      try {
        const response = await loginWithMagicLink(email, token);
        if (response.success) {
          navigate('/');
        } else {
          setError(response.message || 'Verification failed');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Magic link expired or invalid');
      }
    };

    verify();
  }, [searchParams, loginWithMagicLink, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {error ? 'Login Failed' : 'Logging you in...'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {error ? (
            <div className="space-y-4">
              <p className="text-red-600">{error}</p>
              <a href="/login" className="text-blue-600 hover:underline">
                Back to login
              </a>
            </div>
          ) : (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
