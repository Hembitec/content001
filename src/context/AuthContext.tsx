import { createContext, useContext, useEffect, useState } from 'react';
import {
  Auth,
  User,
  UserCredential,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  setPersistence,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  reauthenticateWithCredential,
  deleteUser,
  EmailAuthProvider,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../config/firebase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string }>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const getErrorMessage = (error: string) => {
  if (error.includes('auth/email-already-in-use')) {
    return 'Email is already registered. Please sign in or use a different email.';
  }
  if (error.includes('auth/invalid-email')) {
    return 'Invalid email address. Please check and try again.';
  }
  if (error.includes('auth/operation-not-allowed')) {
    return 'Email/password sign up is not enabled. Please contact support.';
  }
  if (error.includes('auth/weak-password')) {
    return 'Password is too weak. Please use a stronger password.';
  }
  if (error.includes('auth/user-disabled')) {
    return 'This account has been disabled. Please contact support.';
  }
  if (error.includes('auth/user-not-found') || error.includes('auth/wrong-password')) {
    return 'Invalid email or password. Please try again.';
  }
  return 'An error occurred. Please try again.';
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let unsubscribe: () => void;

    const initializeAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        
        unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          try {
            if (currentUser) {
              await currentUser.reload();
              setUser(currentUser);
              
              // Handle navigation based on verification status
              const isVerifyPage = location.pathname === '/verify';
              const isHomePage = location.pathname === '/';
              const isDashboardPage = location.pathname === '/dashboard';

              if (currentUser.emailVerified) {
                if (isVerifyPage || isHomePage) {
                  navigate('/dashboard', { replace: true });
                }
              } else {
                if (!isVerifyPage && !isHomePage) {
                  navigate('/verify', { replace: true });
                }
              }
            } else {
              setUser(null);
              if (location.pathname !== '/') {
                navigate('/', { replace: true });
              }
            }
          } catch (error) {
            console.error("Error in auth state change:", error);
            setUser(null);
          }
        });
      } catch (error) {
        console.error("Error setting persistence:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [navigate, location.pathname]);

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await userCredential.user.updateProfile({ displayName: name });
      await sendEmailVerification(userCredential.user);
      return {
        success: true,
        message: 'Account created successfully! Please check your email for verification.',
      };
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.message);
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        // Send another verification email if user is not verified
        await sendEmailVerification(userCredential.user);
        navigate('/verify', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.message);
      throw new Error(errorMessage);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      if (!userCredential.user.emailVerified) {
        await sendEmailVerification(userCredential.user);
        navigate('/verify', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.message);
      throw new Error(errorMessage);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      navigate('/', { replace: true });
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.message);
      throw new Error(errorMessage);
    }
  };

  const deleteAccount = async (password: string) => {
    if (!user) throw new Error('No user logged in');

    try {
      // Re-authenticate user before deletion
      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user, credential);
      
      // Now delete the user
      await deleteUser(user);
      setUser(null);
      navigate('/', { replace: true });
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.message);
      throw new Error(errorMessage);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: 'Password reset email sent! Please check your inbox.',
      };
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.message);
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const value = {
    user,
    loading,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    deleteAccount,
    resetPassword,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
