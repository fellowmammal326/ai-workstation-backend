import React, { useState } from 'react';
import api from '../../services/api';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
    }
    try {
      await api.post('/auth/register', { email, password });
      setSuccess('Account created successfully! Please log in.');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account');
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email-signup" className="block text-sm font-medium text-text-secondary">Email address</label>
        <input id="email-signup" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 text-text-primary bg-primary border rounded-md border-border-color focus:outline-none focus:ring-accent focus:border-accent" />
      </div>
      <div>
        <label htmlFor="password-signup" className="block text-sm font-medium text-text-secondary">Password</label>
        <input id="password-signup" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 text-text-primary bg-primary border rounded-md border-border-color focus:outline-none focus:ring-accent focus:border-accent" />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-500">{success}</p>}
      <div>
        <button type="submit" className="w-full px-4 py-2 font-medium text-white bg-accent rounded-md hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">Sign up</button>
      </div>
    </form>
  );
};

export default Signup;
