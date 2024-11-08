import React from 'react'
import { Button } from '../ui/button'
import { AiOutlineMenu } from "react-icons/ai";
import { CiLogout } from "react-icons/ci";

import { logout as logoutAction } from '@/redux/features/auth/authSlice';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { AlignJustify } from 'lucide-react';
import { useLogoutMutation } from '@/redux/api/userApiSlice';
import { useNavigate } from 'react-router-dom';


const Header = ({setopen}) => {
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch=useDispatch()
  const navigate=useNavigate()

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout mutation
      dispatch(logoutAction()); // Dispatch the logout action to clear the Redux state
      toast.success('Logout successful!');
      navigate('/login'); // Redirect after logout
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  
  return (
    <div className='flex items-center justify-between bg-background border-b px-4 py-3'>
     <Button onClick={()=>setopen(true)} className="lg:hidden sm:block">
      <AlignJustify/>
      <span className='sr-only'>toggle menu</span>
     </Button>
      

      <div className='flex flex-1 justify-end'>
        <Button className="inline-flex gap-2 items-center rounded-full shadow" onClick={handleLogout}>
           <CiLogout />
           Log out
        </Button>
      </div>
    </div>
  )
}

export default Header