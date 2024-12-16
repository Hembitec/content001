import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sendEmailVerification } from 'firebase/auth';
import clsx from 'clsx';
import { Mail, ArrowLeft } from 'lucide-react';
import { theme } from '../../styles/theme';

interface AuthFormProps {
  isCompact?: boolean;
  onSuccess?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ isCompact = false, onSuccess }) => {
  const { signUpWithEmail, signInWithEmail, resetPassword, signInWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isForgotPassword) {
        const result = await resetPassword(email);
        if (result.success) {
          setMessage(result.message);
          setStatus('success');
        } else {
          setError(result.message);
          setStatus('error');
        }
      } else if (isSignUp) {
        if (!name.trim()) {
          setError('Please enter your name');
          setStatus('error');
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setStatus('error');
          setIsLoading(false);
          return;
        }
        const result = await signUpWithEmail(email, password, name.trim());
        if (result.success) {
          setMessage(result.message);
          setStatus('success');
        } else {
          setError(result.message);
          setStatus('error');
        }
      } else {
        await signInWithEmail(email, password);
        onSuccess?.();
      }
    } catch (err: any) {
      setError(err.message);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isForgotPassword) {
    return (
      <div className={clsx(theme.components.card, "w-full max-w-md mx-auto p-8", isCompact && "p-6")}>
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className={clsx("w-8 h-8", theme.colors.text.accent)} />
        </div>

        <h2 className={clsx("text-2xl font-bold text-center mb-2", theme.colors.text.primary)}>
          Reset Password
        </h2>
        
        <p className={clsx("text-center mb-8", theme.colors.text.secondary)}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {(message || error) && (
          <div className={clsx(
            "mb-6 p-4 rounded-lg text-sm",
            status === 'success' ? theme.colors.status.success.bg + ' ' + theme.colors.status.success.text :
            theme.colors.status.error.bg + ' ' + theme.colors.status.error.text
          )}>
            {message || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className={clsx("block text-sm font-medium mb-1", theme.colors.text.secondary)}>
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={theme.components.input}
              required
            />
          </div>

          <button
            type="submit"
            disabled={!email || isLoading}
            className={clsx(
              theme.components.button.base,
              (!email || isLoading)
                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : theme.colors.button.primary
            )}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <button
          onClick={() => {
            setIsForgotPassword(false);
            setError('');
            setMessage('');
            setStatus('idle');
          }}
          className={clsx("mt-6 inline-flex items-center gap-2 text-sm", theme.colors.text.secondary, "hover:" + theme.colors.text.accent)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </button>
      </div>
    );
  }

  return (
    <div className={clsx(theme.components.card, "w-full max-w-md mx-auto p-8", isCompact && "p-6")}>
      <h2 className={clsx("text-2xl font-bold text-center mb-8", theme.colors.text.primary)}>
        {isSignUp ? 'Create an account' : 'Welcome back'}
      </h2>

      {error && (
        <div className={clsx("mb-6 p-4 rounded-lg text-sm", theme.colors.status.error.bg, theme.colors.status.error.text)}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <div>
            <label htmlFor="name" className={clsx("block text-sm font-medium mb-1", theme.colors.text.secondary)}>
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className={theme.components.input}
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className={clsx("block text-sm font-medium mb-1", theme.colors.text.secondary)}>
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className={theme.components.input}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className={clsx("block text-sm font-medium mb-1", theme.colors.text.secondary)}>
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className={theme.components.input}
            required
          />
        </div>

        {isSignUp && (
          <div>
            <label htmlFor="confirmPassword" className={clsx("block text-sm font-medium mb-1", theme.colors.text.secondary)}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className={theme.components.input}
              required
            />
          </div>
        )}

        {!isSignUp && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className={clsx("h-4 w-4 rounded border-2", theme.colors.border.light, theme.colors.text.accent)}
              />
              <label htmlFor="remember" className={clsx("ml-2 block text-sm", theme.colors.text.secondary)}>
                Remember me
              </label>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsForgotPassword(true);
                setError('');
              }}
              className={clsx("text-sm font-medium", theme.colors.text.accent)}
            >
              Forgot password?
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={clsx(
            theme.components.button.base,
            isLoading
              ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : theme.colors.button.primary
          )}
        >
          {isLoading ? "Please wait..." : (isSignUp ? "Create Account" : "Sign In")}
        </button>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className={clsx("w-full border-t", theme.colors.border.light)} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={clsx("px-2", theme.colors.text.secondary, theme.colors.background.primary)}>
                Or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => signInWithGoogle().catch(err => setError(err.message))}
            className={clsx(
              theme.components.button.base,
              theme.colors.button.secondary,
              "mt-4 w-full flex items-center justify-center gap-3"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </form>

      <p className={clsx("mt-6 text-center text-sm", theme.colors.text.secondary)}>
        {isSignUp ? "Already have an account? " : "Don't have an account? "}
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setName('');
          }}
          className={clsx("font-medium", theme.colors.text.accent)}
        >
          {isSignUp ? "Sign in" : "Sign up"}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;