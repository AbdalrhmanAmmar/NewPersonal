import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, Target, Settings, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Logout from './Logout';

const Sidebar = () => {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
    { path: '/expenses', label: 'Track Expenses', icon: <Receipt /> },
    { path: '/analytics', label: 'Analytics', icon: <PieChart /> },
    { path: '/goals', label: 'Goals', icon: <Target /> },
    // { path: '/settings', label: 'Settings', icon: <Settings /> },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 transition-colors duration-200 ease-in-out border-r dark:border-dark-700 shadow-sm dark:shadow-none bg-white dark:bg-dark-900">
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">ExpenseTracker</h2>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                location.pathname === item.path
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-800'
              }`}
            >
              <span className="w-5 h-5">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
                
          ))}
     
        </nav>
        <div className=' text-center mt-10'>
        <Logout/>

        </div>
    
      </div>
    </aside>
  );
}

export default Sidebar;