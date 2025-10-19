
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationProvider';
import { Icon } from '../../components/Icon';
import { UserRole } from '../../types';

export const AdminLoginPage: React.FC = () => {
  const { login, currentUser } = useAuth();
  const { onGoToAdminDashboard, onGoToHome } = useNavigation();
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If an admin is already logged in, redirect to dashboard
    if (currentUser && currentUser.role === UserRole.Admin) {
      onGoToAdminDashboard();
    }
  }, [currentUser, onGoToAdminDashboard]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user?.role !== UserRole.Admin) {
        setError('Access denied. Not an administrator.');
      } else {
        onGoToAdminDashboard();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to log in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <Icon name="logo" className="h-12 w-12 text-indigo-400 mx-auto" />
            <h1 className="text-3xl font-bold tracking-tight mt-2">TheFreed Admin</h1>
        </div>
        <div className="bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3" />
                </div>
                <div>
                    <label htmlFor="password"className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                    <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3" />
                </div>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-indigo-800 disabled:cursor-not-allowed">
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
        </div>
        <div className="text-center mt-6">
            <button onClick={onGoToHome} className="text-sm text-gray-500 hover:text-indigo-400">← Back to Main Site</button>
        </div>
      </div>
    </div>
  );
};