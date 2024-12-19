import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { ContentAnalyzer } from './pages/tools/ContentAnalyzer';
import NLPGenerator from './pages/tools/NLPGenerator';
import { SocialMediaConverter } from './pages/tools/SocialMediaConverter';
import { VerifyEmail } from './pages/VerifyEmail';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import AuthForm from './components/auth/AuthForm';
import { Header } from './components/header/Header';
import clsx from 'clsx';

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/verify" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const location = useLocation();
  
  return (
    <div className={clsx(
      "min-h-screen bg-gradient-to-br from-blue-50 to-white transition-colors duration-200",
      darkMode && "dark from-gray-900 to-gray-800"
    )}>
      {user && location.pathname !== '/tools/nlp-generator' && 
       location.pathname !== '/analyzer' && 
       location.pathname !== '/tools/social-converter' && <Header />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/analyzer" element={<ContentAnalyzer />} />
        <Route path="/tools/nlp-generator" element={<NLPGenerator />} />
        <Route path="/tools/social-converter" element={<SocialMediaConverter />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;