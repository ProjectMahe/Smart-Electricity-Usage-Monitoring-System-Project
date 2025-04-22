import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { users } from '../data/mockData';
import { User } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Users, User as UserIcon, BarChart3, Settings, Search } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'users' | 'analytics' | 'settings'>('users');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchUsers = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAllUsers(users);
      setIsLoading(false);
    };
    
    fetchUsers();
  }, []);

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.meterNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <Card>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedTab('users')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    selectedTab === 'users'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Users className="mr-3 h-5 w-5" />
                  User Management
                </button>
                <button
                  onClick={() => setSelectedTab('analytics')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    selectedTab === 'analytics'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="mr-3 h-5 w-5" />
                  Analytics
                </button>
                <button
                  onClick={() => setSelectedTab('settings')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    selectedTab === 'settings'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="mr-3 h-5 w-5" />
                  System Settings
                </button>
              </div>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            {selectedTab === 'users' && (
              <Card>
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">User Management</h2>
                  <p className="text-gray-500 text-sm">Manage system users and their permissions</p>
                </div>
                
                <div className="mb-4 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users by name, email, or meter number..."
                    className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Meter Number
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  <UserIcon className="h-6 w-6 text-gray-500" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {user.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.meterNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {user.role === 'admin' ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  Admin
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  User
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mr-2"
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-6 py-4 text-sm text-gray-500 text-center">
                              No users found matching your search criteria
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            )}
            
            {selectedTab === 'analytics' && (
              <Card>
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">System Analytics</h2>
                  <p className="text-gray-500 text-sm">View system-wide usage and performance metrics</p>
                </div>
                
                <div className="py-12 text-center text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p>Analytics dashboard is under development</p>
                  <p className="text-sm mt-2">Check back soon for system-wide metrics and reports</p>
                </div>
              </Card>
            )}
            
            {selectedTab === 'settings' && (
              <Card>
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">System Settings</h2>
                  <p className="text-gray-500 text-sm">Configure application settings and preferences</p>
                </div>
                
                <div className="py-12 text-center text-gray-500">
                  <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p>Settings dashboard is under development</p>
                  <p className="text-sm mt-2">Check back soon for system configuration options</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;