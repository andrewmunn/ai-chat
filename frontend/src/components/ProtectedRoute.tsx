import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // check if there is an auth token in localStorage
    const isAuth = localStorage.getItem('token');
    return isAuth ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;