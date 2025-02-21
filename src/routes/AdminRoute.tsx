import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const AdminRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  // Show loading spinner while the auth state is being loaded
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Redirect to login if the user isn't authenticated
  if (isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  // Redirect if the user is authenticated but not an admin
  if (!user || !user.roles.includes('ADMIN')) {
    return <Navigate to="/" replace />;
  }

  // Render the child routes if authenticated and authorized
  return <Outlet />;
};
