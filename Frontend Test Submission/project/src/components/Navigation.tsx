import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Link as LinkIcon, BarChart3 } from 'lucide-react';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <LinkIcon className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LinkShort
            </span>
          </div>
          
          <div className="flex space-x-6">
            <Link
              to="/"
              className={`px-4 py-2 rounded-full transition-all duration-300 font-medium ${
                isActive('/')
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Shorten
            </Link>
            <Link
              to="/stats"
              className={`px-4 py-2 rounded-full transition-all duration-300 font-medium flex items-center space-x-2 ${
                isActive('/stats')
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Statistics</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};