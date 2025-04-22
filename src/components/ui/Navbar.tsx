import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  BarChart3, 
  Home,
  FileText,
  Settings,
  Users,
  Zap
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Zap className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">EnergyTrack</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user && (
              <>
                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center">
                  <Home className="w-4 h-4 mr-1" />
                  Dashboard
                </Link>
                <Link to="/usage" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Usage
                </Link>
                <Link to="/billing" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  Billing
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Admin
                  </Link>
                )}
                <Link to="/profile" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center">
                  <UserIcon className="w-4 h-4 mr-1" />
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </button>
              </>
            )}
            {!user && (
              <>
                <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Login
                </Link>
                <Link to="/register" className="ml-2 px-3 py-2 bg-white text-blue-600 rounded-md text-sm font-medium hover:bg-gray-100">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user && (
              <>
                <Link
                  to="/"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="w-5 h-5 mr-2" />
                  Dashboard
                </Link>
                <Link
                  to="/usage"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Usage
                </Link>
                <Link
                  to="/billing"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Billing
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <UserIcon className="w-5 h-5 mr-2" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 flex items-center"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </>
            )}
            {!user && (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 bg-white text-blue-600 rounded-md text-base font-medium hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;