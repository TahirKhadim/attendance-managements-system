import { useState } from 'react'
import Register from './pages/auth/register'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify';
import AuthLayout from './components/auth/layout';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login';
import Layout from './components/user/Layout';
import 'react-toastify/dist/ReactToastify.css';

import AdminLayout from './components/admin/Layout';
import AdminDashboard from './pages/adminView/adminDashboard';
import UserHome from './pages/userView/UserHome';
import CheckAuth from './components/common/check-auth';
import ManageAttendance from './pages/adminView/ManageAttendance';
import ViewReports from './pages/adminView/Reports';

import EditProfile from './pages/userView/editProfile';
import EditPassword from './pages/userView/editPassword';
import Attendance from './pages/userView/attendance';
import AttendanceList from './pages/userView/AttendanceList';
import Leave from './pages/userView/Leave';
import ViewLeave from './pages/userView/viewLeave';
import LeaveApproval from './pages/adminView/LeaveApproval';
import UserManagement from './pages/adminView/userManagement';
import UserAttendanceList from './pages/adminView/userAttList';
import GenerateUserReport from './pages/adminView/UserReport';
import GenerateSystemReport from './pages/adminView/SystemReport';
import AttendanceReport from './pages/userView/Report';



function App() {
  const {userInfo,isLoading}=useSelector((state)=>state.auth);


  return (
   <div className='h-screen grid place-items-center bg-gray-50'>
    <ToastContainer />
        <Routes>
          {/* Authentication Routes */}
          <Route path="/" element={<AuthLayout />}>
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
      
          </Route>

          <Route element={<CheckAuth />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="manage-attendance" element={<ManageAttendance />} />
              <Route path="reports" element={<ViewReports />} />
              <Route path="leave-approval" element={<LeaveApproval />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="view-attendance/:userId" element={<UserAttendanceList />} />
              <Route path='generate-user-report' element={<GenerateUserReport />} />
              <Route path='generate-system-report' element={<GenerateSystemReport />} />
              
             
              
            
            </Route>
          </Route>

          <Route element={<CheckAuth />}>
            <Route path="/user" element={<Layout />}>
              <Route path="home" element={<UserHome />} />
              <Route path="profile" element={<EditProfile />} />
              <Route path="password" element={<EditPassword />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="view-attendance" element={<AttendanceList />} />
              <Route path="mark-leave" element={<Leave />} />
              <Route path="view-leave" element={<ViewLeave />} />
              <Route path="view-report" element={<AttendanceReport />} />
              
             
            </Route>
          </Route>

          
        
   
            
           






       

        
             
        

          </Routes>

   </div>
  )
}

export default App
