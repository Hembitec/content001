import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Mail, RefreshCw, LogOut, AlertCircle, X } from 'lucide-react';
import clsx from 'clsx';

export function VerifyEmail() {
  const { user, signOut, loading, deleteAccount } = useAuth();
  const [resendDisabled, setResendDisabled] = useState(false);
  const [message, setMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // If no user, redirect to home
    if (!loading && !user) {
      navigate('/', { replace: true });
      return;
    }

    // If user is verified, redirect to dashboard
    if (!loading && user?.emailVerified) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't render anything if no user or if user is verified
  if (!user || user.emailVerified) {
    return null;
  }

  const handleResendEmail = async () => {
    if (!user || resendDisabled) return;
    
    try {
      setResendDisabled(true);
      setMessage('');
      await sendEmailVerification(user);
      setMessage('Verification email sent! Please check your inbox.');
      
      // Disable resend button for 60 seconds
      setTimeout(() => {
        setResendDisabled(false);
      }, 60000);
    } catch (error) {
      setMessage('Failed to resend verification email. Please try again later.');
      setResendDisabled(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !password) return;
    
    try {
      setIsDeleting(true);
      setMessage('');
      await deleteAccount(password);
    } catch (error: any) {
      setMessage(error.message || 'Failed to delete account. Please try again.');
      setShowDeleteConfirm(false);
      setPassword('');
    } finally {
      setIsDeleting(false);
    }
  };

  const checkVerification = async () => {
    if (!user) return;
    
    try {
      setMessage('');
      await user.reload();
      if (user.emailVerified) {
        navigate('/dashboard', { replace: true });
      } else {
        setMessage('Email not verified yet. Please check your inbox and click the verification link.');
      }
    } catch (error) {
      setMessage('Failed to check verification status. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Verify your email
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          We've sent a verification email to:
        </p>
        <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">
          {user.email}
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Please check your inbox and click the verification link.
        </p>

        {message && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
            {message}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleResendEmail}
            disabled={resendDisabled || isDeleting}
            className={clsx(
              "w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors",
              (resendDisabled || isDeleting)
                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            <RefreshCw className={clsx("w-4 h-4", (resendDisabled || isDeleting) && "opacity-50")} />
            {resendDisabled ? "Wait 60s to resend" : "Resend verification email"}
          </button>

          <button
            onClick={checkVerification}
            disabled={isDeleting}
            className="w-full px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            I've verified my email
          </button>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p className="text-left">
                  If you entered the wrong email, you can delete this account and create a new one with the correct email.
                </p>
              </div>
            </div>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-4 h-4" />
                Back home
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Confirm your password to delete account:</p>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setPassword('');
                    }}
                    className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || !password}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Deleting account..." : "Confirm Delete Account"}
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Didn't receive the email? Check your spam folder or click the resend button above.
        </p>
      </div>
    </div>
  );
}
