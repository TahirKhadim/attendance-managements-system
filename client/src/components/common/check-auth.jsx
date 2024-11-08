import Loader from '@/pages/loader/Loader';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const CheckAuth = () => {
  const { userInfo, isLoading } = useSelector((state) => state.auth);

  const user = userInfo.user;
  const location = useLocation();

  // While loading, show the loader
  if (isLoading) {
    return <Loader />;
  }

  // Define paths for easy reference
  const loginPath = '/login';
  const registerPath = '/register';
  const adminPath = '/admin';
  const userPath = '/user';

  // Allow access to login and register pages if not authenticated
  if (!userInfo) {
    if (!location.pathname.includes(loginPath) && !location.pathname.includes(registerPath)) {
      return <Navigate to={loginPath} replace />;
    }
  }

  if (location.pathname === "/") {
    if (!userInfo) {
      return <Navigate to="/login" />;
    } else {
      if (user?.isAdmin) {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/user/home" />;
      }
    }
  }


  if (
    !userInfo &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    return <Navigate to="/login" />;
  }

  if (
    userInfo &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.isAdmin) {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/user/home" />;
    }
  }

 

  
  
   
    if (user) {
      // Redirect based on user role
      if (user.isAdmin) {
        // Allow access to admin routes; if not on an admin route, redirect to admin dashboard
        if (!location.pathname.includes(adminPath)){
          return <Navigate to={`${adminPath}/dashboard`} replace />;
        }
      } else {
        // If the user is not an admin, restrict to user routes
        if (!location.pathname.includes(userPath))  {
          return <Navigate to={`${userPath}/home`} replace />;
        }
      }
    }
 

  // Render the Outlet for all other cases
  return <Outlet />;
};

export default CheckAuth;
