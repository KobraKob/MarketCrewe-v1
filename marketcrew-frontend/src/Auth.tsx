import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface AuthProps {
  onLoginSuccess: () => void;
  initialMode: 'login' | 'signup';
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess, initialMode }) => {
  const [isRegistering, setIsRegistering] = useState(initialMode === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const BACKEND_URL = "http://localhost:8000";

  useEffect(() => {
    setIsRegistering(initialMode === 'signup');
  }, [initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      if (isRegistering) {
        await axios.post(`${BACKEND_URL}/auth/register`, { email, password });
        setMessage('Registration successful! You can now log in.');
        setIsRegistering(false); // Switch to login after successful registration
      } else {
        const response = await axios.post(`${BACKEND_URL}/auth/login`, { email, password });
        localStorage.setItem('access_token', response.data.token);
        setMessage('Login successful!');
        onLoginSuccess(response.data.user_profile);
      }
    } catch (error: any) {
      console.error('Auth error:', error.response?.data || error.message);
      setMessage(`Authentication failed: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] p-8 lg:p-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          {isRegistering ? 'Register' : 'Login'}
        </h2>
        {message && (
          <div className={`mb-4 p-3 rounded-md text-center ${message.includes('successful') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-bold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${loading ? 'animate-pulse' : ''}`}
          >
            {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Login')}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          {isRegistering ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setMessage(null); // Clear message when switching modes
            }}
            className="text-blue-600 hover:underline font-semibold"
          >
            {isRegistering ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
