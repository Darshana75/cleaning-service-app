import React, { useState } from 'react';
import axios from 'axios';

function AuthPage({ setToken, setUserId, setIsAdmin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:5000/auth/login', { username, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.userId);
        localStorage.setItem('isAdmin', res.data.isAdmin);
        setToken(res.data.token);
        setUserId(res.data.userId);
        setIsAdmin(res.data.isAdmin);
      } else {
        await axios.post('http://localhost:5000/auth/register', { username, password });
        setMessage('✅ Registration successful! Please log in.');
        setIsLogin(true);
      }
    } catch (err) {
      setMessage('❌ Authentication failed. Try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-200 to-purple-300">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-10 rounded-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          {isLogin ? 'Login' : 'Create an Account'}
        </h2>
        {message && <p className="text-center text-red-600 text-sm mb-4">{message}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
        <p className="mt-4 text-sm text-center">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setMessage(''); }}
            className="text-indigo-600 font-semibold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </form>
    </div>
  );
}

export default AuthPage; 