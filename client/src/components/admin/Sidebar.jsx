import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { Button } from '../ui/button'; // Ensure this import is correct
import { ChartNoAxesCombined } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';

const Sidebar = ({ open, setopen }) => {
  const [isOpen, setIsOpen] = useState(false); 
  const sidebarItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Manage Attendance', path: '/admin/manage-attendance' },
    { name: 'Generate Reports', path: '/admin/reports' },
    { name: 'Leave', path: '/admin/leave-approval' },
    { name: 'Users', path: '/admin/users' },
  ];

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="flex">
      <Sheet open={open} onOpenChange={setopen}>
        <SheetContent side="left" className="w-64">
          <div className='flex flex-col h-full'>
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-3"><ChartNoAxesCombined /><span>Admin Panel</span></SheetTitle>
            </SheetHeader>
            <ul className="space-y-2 mt-6">
              {sidebarItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `block p-2 rounded hover:bg-muted ${isActive ? 'bg-gray-700' : ''}`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </SheetContent>
      </Sheet>

      <aside className='w-64 border-r hidden bg-background p-6 lg:flex'>
        <div className="sidebar-content p-4">
          <div className="flex justify-between items-center gap-4">
            <ChartNoAxesCombined />
            <h2 className={`text-xl font-extrabold`}>Admin Panel</h2>
            <Button onClick={toggleSidebar} className="text-white lg:hidden">
              <AiOutlineClose />
            </Button>
          </div>
          <nav>
            <ul className="space-y-2 mt-6">
              {sidebarItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `block p-2 rounded hover:bg-muted ${isActive ? 'bg-gray-700' : ''}`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
