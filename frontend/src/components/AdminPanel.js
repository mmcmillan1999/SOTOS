import React, { useState } from 'react';

function AdminPanel({ onLogin, onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full border-2 border-purple-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-nunito font-bold text-purple-800">Admin Login</h2>
          <button
            onClick={onClose}
            className="text-purple-600 hover:text-purple-800 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-purple-700 font-semibold mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Matt, Tug, or Jenny"
              className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-purple-700 font-semibold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:outline-none"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-nunito font-bold"
          >
            Login
          </button>
        </form>
        
        <p className="mt-4 text-sm text-gray-600 text-center">
          Admin access only for score entry
        </p>
      </div>
    </div>
  );
}

export default AdminPanel;