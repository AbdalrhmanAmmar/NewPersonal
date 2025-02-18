import React, { useState } from 'react';
import {
  User,
  Lock,
  Bell,
  Palette,
  Database,
  Link,
  HelpCircle,
  ChevronRight,
  Camera,
  DollarSign,
  Calendar,
  Download,
  Upload,
  Trash2,
  Shield,
  Languages,
  FileText,
  Mail,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

// Mock user data - replace with real data later
const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('profile');
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    billReminders: true,
    goalUpdates: true,
    weeklyReports: false,
  });

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'data', label: 'Data Management', icon: Database },
    { id: 'integrations', label: 'Integrations', icon: Link },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex gap-6">
        {/* Settings Navigation */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm">
            <nav className="p-4">
              {sections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                    activeSection === id
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 space-y-6">
          {/* Profile Settings */}
          {activeSection === 'profile' && (
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm">
              <div className="p-6 border-b dark:border-dark-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Profile Settings</h2>
                <p className="text-gray-600 dark:text-gray-400">Manage your personal information</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-4">
                  <img
                    src={mockUser.avatar}
                    alt="Profile"
                    className="w-20 h-20 rounded-full"
                  />
                  <div>
                    <button className="flex items-center px-4 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors">
                      <Camera className="w-4 h-4 mr-2" />
                      Change Photo
                    </button>
                  </div>
                </div>

                {/* Personal Information Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={mockUser.name}
                      className="w-full px-3 py-2 border dark:border-dark-600 rounded-lg dark:bg-dark-700 dark:text-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={mockUser.email}
                      className="w-full px-3 py-2 border dark:border-dark-600 rounded-lg dark:bg-dark-700 dark:text-gray-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeSection === 'security' && (
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm">
              <div className="p-6 border-b dark:border-dark-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Security Settings</h2>
                <p className="text-gray-600 dark:text-gray-400">Manage your account security</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Password Change */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Change Password</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border dark:border-dark-600 rounded-lg dark:bg-dark-700 dark:text-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border dark:border-dark-600 rounded-lg dark:bg-dark-700 dark:text-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border dark:border-dark-600 rounded-lg dark:bg-dark-700 dark:text-gray-200"
                    />
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Update Password
                  </button>
                </div>

                {/* Two-Factor Authentication */}
                <div className="pt-6 border-t dark:border-dark-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Two-Factor Authentication</h3>
                      <p className="text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
                    </div>
                    <button className="px-4 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeSection === 'notifications' && (
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm">
              <div className="p-6 border-b dark:border-dark-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Notification Preferences</h2>
                <p className="text-gray-600 dark:text-gray-400">Choose what notifications you want to receive</p>
              </div>
              <div className="p-6 space-y-6">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-800 dark:text-gray-200 font-medium">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Receive notifications about your {key.toLowerCase()}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preferences Settings */}
          {activeSection === 'preferences' && (
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm">
              <div className="p-6 border-b dark:border-dark-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">App Preferences</h2>
                <p className="text-gray-600 dark:text-gray-400">Customize your app experience</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-800 dark:text-gray-200 font-medium">Dark Mode</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isDarkMode}
                      onChange={toggleTheme}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Currency Selection */}
                <div>
                  <h3 className="text-gray-800 dark:text-gray-200 font-medium mb-2">Default Currency</h3>
                  <select className="w-full px-3 py-2 border dark:border-dark-600 rounded-lg dark:bg-dark-700 dark:text-gray-200">
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                  </select>
                </div>

                {/* Date Format */}
                <div>
                  <h3 className="text-gray-800 dark:text-gray-200 font-medium mb-2">Date Format</h3>
                  <select className="w-full px-3 py-2 border dark:border-dark-600 rounded-lg dark:bg-dark-700 dark:text-gray-200">
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Data Management */}
          {activeSection === 'data' && (
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm">
              <div className="p-6 border-b dark:border-dark-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Data Management</h2>
                <p className="text-gray-600 dark:text-gray-400">Export, import, or manage your data</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <button className="flex items-center justify-between p-4 border dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                    <div className="flex items-center">
                      <Download className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div className="text-left">
                        <h3 className="text-gray-800 dark:text-gray-200 font-medium">Export Data</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Download your data as CSV</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>

                  <button className="flex items-center justify-between p-4 border dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                    <div className="flex items-center">
                      <Upload className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div className="text-left">
                        <h3 className="text-gray-800 dark:text-gray-200 font-medium">Import Data</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Import data from CSV</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>

                  <button className="flex items-center justify-between p-4 border dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors text-red-600 dark:text-red-400">
                    <div className="flex items-center">
                      <Trash2 className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <h3 className="font-medium">Clear All Data</h3>
                        <p className="text-sm">Permanently delete all your data</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Integrations */}
          {activeSection === 'integrations' && (
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm">
              <div className="p-6 border-b dark:border-dark-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Connected Accounts</h2>
                <p className="text-gray-600 dark:text-gray-400">Manage your connected accounts and services</p>
              </div>
              <div className="p-6 space-y-4">
                <button className="w-full flex items-center justify-between p-4 border dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
                      <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-gray-800 dark:text-gray-200 font-medium">Connect Bank Account</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Sync your transactions automatically</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-4 border dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
                      <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-gray-800 dark:text-gray-200 font-medium">Calendar Integration</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Sync bill due dates with your calendar</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          )}

          {/* Help & Support */}
          {activeSection === 'help' && (
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm">
              <div className="p-6 border-b dark:border-dark-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Help & Support</h2>
                <p className="text-gray-600 dark:text-gray-400">Get help and learn more about the app</p>
              </div>
              <div className="p-6 space-y-4">
                <button className="w-full flex items-center justify-between p-4 border dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <div className="text-left">
                      <h3 className="text-gray-800 dark:text-gray-200 font-medium">Documentation</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Read the user guide</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-4 border dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <div className="text-left">
                      <h3 className="text-gray-800 dark:text-gray-200 font-medium">Contact Support</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Get help from our team</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <h3 className="text-blue-800 dark:text-blue-200 font-medium">Need Help?</h3>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    Our support team is available 24/7 to help you with any questions or issues.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;