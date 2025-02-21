import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const PrivateRoute = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  // If user is undefined, logout and clear session
  useEffect(() => {
    if (!user) {
      logout(); // Clear session if user is undefined
    }
  }, [user, logout]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
