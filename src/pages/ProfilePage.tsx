import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { User, Mail, MapPin, Hash, Save } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
    meterNumber: user?.meterNumber || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you'd update the user profile in the database
      
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditing(false);
      }, 2000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
        
        <Card>
          <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
            {!isEditing ? (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            )}
          </div>
          
          {saveSuccess && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Profile updated successfully!
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            {isEditing ? (
              <>
                <div>
                  <div className="flex items-center mb-2">
                    <User className="h-5 w-5 text-gray-500 mr-2" />
                    <label htmlFor="name" className="font-medium text-gray-700">Full Name</label>
                  </div>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                  />
                </div>
                
                <div>
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
                    fullWidth
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                    <label htmlFor="address" className="font-medium text-gray-700">Address</label>
                  </div>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    fullWidth
                  />
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <Hash className="h-5 w-5 text-gray-500 mr-2" />
                    <label htmlFor="meterNumber" className="font-medium text-gray-700">Meter Number</label>
                  </div>
                  <Input
                    id="meterNumber"
                    name="meterNumber"
                    value={formData.meterNumber}
                    onChange={handleChange}
                    fullWidth
                  />
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    isLoading={isSaving}
                    className="flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex">
                  <User className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                    <p className="mt-1 text-gray-900">{user.name}</p>
                  </div>
                </div>
                
                <div className="flex">
                  <Mail className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                    <p className="mt-1 text-gray-900">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex">
                  <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                    <p className="mt-1 text-gray-900">{user.address}</p>
                  </div>
                </div>
                
                <div className="flex">
                  <Hash className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Meter Number</h3>
                    <p className="mt-1 text-gray-900">{user.meterNumber}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
        
        <Card className="mt-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Password & Security</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Button variant="outline" className="mr-4">
                Change Password
              </Button>
              <Button variant="outline">
                Enable Two-Factor Authentication
              </Button>
            </div>
            
            <p className="text-sm text-gray-500 mt-2">
              For security reasons, password changes require verification of your current password.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;