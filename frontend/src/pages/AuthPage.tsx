import { useState } from 'react';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary">
      <div className="w-full max-w-md p-8 space-y-8 bg-secondary rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-text-primary">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
        </div>
        {isLogin ? <Login /> : <Signup />}
        <div className="text-sm text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-accent hover:text-accent-hover"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
