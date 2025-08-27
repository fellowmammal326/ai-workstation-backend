import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email address</label>
        <input id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 text-text-primary bg-primary border rounded-md border-border-color focus:outline-none focus:ring-accent focus:border-accent" />
      </div>
      <div>
        <label htmlFor="password"  className="block text-sm font-medium text-text-secondary">Password</label>
        <input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 text-text-primary bg-primary border rounded-md border-border-color focus:outline-none focus:ring-accent focus:border-accent" />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div>
        <button type="submit" className="w-full px-4 py-2 font-medium text-white bg-accent rounded-md hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">Sign in</button>
      </div>
    </form>
  );
};

export default Login;
