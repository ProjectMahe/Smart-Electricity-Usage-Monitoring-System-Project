import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Lock, Mail, Zap } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
      <div className="mx-auto p-10 xs:p-0 md:w-full md:max-w-md">
        <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
          <div className="px-5 py-7">
            <div className="text-center mb-8">
              <Zap className="h-12 w-12 text-blue-600 mx-auto" />
              <h1 className="text-2xl font-bold text-gray-800 mt-2">EnergyTrack</h1>
              <p className="text-gray-500">Smart Electricity Monitoring</p>
            </div>
            
            <h2 className="font-bold text-xl text-gray-700 mb-6">Sign in to your account</h2>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Mail className="h-5 w-5 text-gray-500 mr-2" />
                  <label htmlFor="email" className="font-medium text-gray-700">Email Address</label>
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  fullWidth
                />
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <Lock className="h-5 w-5 text-gray-500 mr-2" />
                  <label htmlFor="password" className="font-medium text-gray-700">Password</label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  fullWidth
                />
              </div>
              
              <Button 
                type="submit" 
                variant="primary" 
                fullWidth 
                isLoading={isLoading}
                size="lg"
              >
                Sign In
              </Button>
            </form>
          </div>
          
          <div className="py-5">
            <div className="flex justify-center">
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up now
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        <div className="py-5">
          <div className="flex justify-center">
            <p className="text-xs text-gray-500">
              For demo purposes, use: admin@example.com / john@example.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;