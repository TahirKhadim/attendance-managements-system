import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side: Welcome Section */}
      <div className="hidden lg:flex items-center justify-center w-1/2 bg-black bg-cover h-screen bg-center px-12 py-16" style={{ backgroundImage: "url('https://tse1.mm.bing.net/th?id=OIP.1YCSuZ4FQvQUKuF2axlyRQHaEo&pid=Api')" }}>
        <div className="absolute inset-0 bg-black opacity-50 w-1/2"></div> 
        
        
      </div>

      {/* Right Side: Auth Forms */}
      <div className="flex flex-1 justify-center items-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
