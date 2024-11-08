import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { BiUser } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction } from '@/redux/features/auth/authSlice';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import logo from '../../assets/logo.jpeg'; 
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useLogoutMutation } from '@/redux/api/userApiSlice';
import { AlignJustify } from 'lucide-react';

const Header = ({ setopen }) => {
  const [logout, { isLoading }] = useLogoutMutation();
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/login';
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(logoutAction());
      toast.success('Logout successful!');
      navigate(redirect);
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setSearchIconVisible(true);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='flex items-center justify-between bg-background border-b px-4 py-3'>
      <Button onClick={() => setopen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className='sr-only'>toggle menu</span>
      </Button>

      <nav className={`bg-white shadow-md px-4 w-full ${isMenuOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="flex justify-between items-center py-2">
          <Link to="/" className="font-bold text-gray-800">
            <img src={logo} alt="logo" className='w-20 h-20 bg-transparent' />
          </Link>
          
          <div className="flex items-center space-x-4">
            <button onClick={handleToggleMenu} className="lg:hidden">
              <AiOutlineSearch />
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline-none" className="flex items-center justify-center p-4 bg-blue-500 text-white rounded-md">
                  <BiUser className='text-xl' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-42 mt-4">
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <NavLink to="/user/profile" className="text-gray-600 hover:text-blue-600">
                    <DropdownMenuItem>
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </NavLink>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <NavLink to="/user/password" className="text-gray-600 hover:text-blue-600">
                  <DropdownMenuItem>
                    <span>Change Password</span>
                  </DropdownMenuItem>
                </NavLink>
                <DropdownMenuItem onClick={handleLogout} disabled={isLoading}>
                  <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Toggle */}
      <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'} absolute top-16 left-0 right-0 bg-white shadow-md`}>
        <div className="flex flex-col p-4">
          <NavLink to="/user/profile" className="text-gray-600 hover:text-blue-600 py-2">Profile</NavLink>
          <NavLink to="/user/password" className="text-gray-600 hover:text-blue-600 py-2">Change Password</NavLink>
          <Button onClick={handleLogout} disabled={isLoading} className="py-2">
            {isLoading ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
