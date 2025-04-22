import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Mail, Lock, User, MapPin, Hash, Zap } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    meterNumber: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.meterNumber.trim()) {
      newErrors.meterNumber = 'Meter number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        meterNumber: formData.meterNumber,
      });
      
      navigate('/');
    } catch (error: any) {
      setErrors({ form: error.message || 'Registration failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12">
      <div className="mx-auto p-6 xs:p-0 md:w-full md:max-w-lg">
        <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
          <div className="px-5 py-7">
            <div className="text-center mb-6">
              <Zap className="h-12 w-12 text-blue-600 mx-auto" />
              <h1 className="text-2xl font-bold text-gray-800 mt-2">EnergyTrack</h1>
              <p className="text-gray-500">Create your account</p>
            </div>
            
            {errors.form && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errors.form}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <User className="h-5 w-5 text-gray-500 mr-2" />
                    <label htmlFor="name" className="font-medium text-gray-700">Full Name</label>
                  </div>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    error={errors.name}
                    fullWidth
                  />
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Mail className="h-5 w-5 text-gray-500 mr-2" />
                    <label htmlFor="email" className="font-medium text-gray-700">Email Address</label>
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    error={errors.email}
                    fullWidth
                  />
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Lock className="h-5 w-5 text-gray-500 mr-2" />
                    <label htmlFor="password" className="font-medium text-gray-700">Password</label>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    error={errors.password}
                    fullWidth
                  />
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Lock className="h-5 w-5 text-gray-500 mr-2" />
                    <label htmlFor="confirmPassword" className="font-medium text-gray-700">Confirm Password</label>
                  </div>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    error={errors.confirmPassword}
                    fullWidth
                  />
                </div>
                
                <div className="mb-4 md:col-span-2">
                  <div className="flex items-center mb-2">
                    <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                    <label htmlFor="address" className="font-medium text-gray-700">Address</label>
                  </div>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main St, City, State"
                    error={errors.address}
                    fullWidth
                  />
                </div>
                
                <div className="mb-6 md:col-span-2">
                  <div className="flex items-center mb-2">
                    <Hash className="h-5 w-5 text-gray-500 mr-2" />
                    <label htmlFor="meterNumber" className="font-medium text-gray-700">Meter Number</label>
                  </div>
                  <Input
                    id="meterNumber"
                    name="meterNumber"
                    type="text"
                    value={formData.meterNumber}
                    onChange={handleChange}
                    placeholder="MT12345678"
                    error={errors.meterNumber}
                    fullWidth
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                variant="primary" 
                fullWidth 
                isLoading={isLoading}
                size="lg"
              >
                Create Account
              </Button>
            </form>
          </div>
          
          <div className="py-5">
            <div className="flex justify-center">
              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;