import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && window.location.pathname !== '/') {
        navigate('/');
      }
      setUser(user);
    });

    return () => unsubscribe();
  }, [navigate]);

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'Firebase: Error (auth/invalid-credential).':
        return 'Incorrect email or password. Please try again.';
      case 'Firebase: Error (auth/email-already-in-use).':
        return 'An account with this email already exists.';
      case 'Firebase: Error (auth/weak-password).':
        return 'Password should be at least 6 characters long.';
      case 'Firebase: Error (auth/invalid-email).':
        return 'Please enter a valid email address.';
      case 'Firebase: Error (auth/user-not-found).':
        return 'No account found with this email.';
      case 'Firebase: Error (auth/too-many-requests).':
        return 'Too many attempts. Please try again later.';
      case 'Firebase: Error (auth/popup-closed-by-user).':
        return 'Sign in was cancelled. Please try again.';
      case 'Firebase: Error (auth/cancelled-popup-request).':
        return 'Another sign in attempt is in progress.';
      case 'Firebase: Error (auth/popup-blocked).':
        return 'Sign in popup was blocked. Please allow popups for this site.';
      default:
        return 'Something went wrong. Please try again.';
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.message);
      throw new Error(errorMessage);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.message);
      throw new Error(errorMessage);
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name
      });
      setUser({ ...userCredential.user, displayName: name });
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.message);
      throw new Error(errorMessage);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      navigate('/');
    } catch (err: any) {
      const errorMessage = getErrorMessage(err.message);
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
