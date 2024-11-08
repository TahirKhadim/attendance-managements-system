import React from 'react';
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useSelector } from 'react-redux';
import { useGetAllUsersQuery } from '@/redux/api/userApiSlice';
import { useViewAllAttandanceQuery } from '@/redux/api/attendanceApiSlice';

// Register necessary components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const AdminDashboard = () => {

    const {userInfo}=useSelector((state)=>state.auth);

    const { data: users, error, isLoading } = useGetAllUsersQuery();
    const userArray = users?.data || [];

    const { data: attendanceRecords, error: fetchError} = useViewAllAttandanceQuery();
  
    const attendanceArray = attendanceRecords?.data || [];

    console.log("attendanceArray",attendanceArray);
    

    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // Sample data
    const totalStudents = userArray.length; // Replace with actual data
   // Format: YYYY-MM-DD

    // Get the number of students marked as "present" today
    const totalPresentToday = attendanceArray.filter(record => {
        
        return record.status === 'present' && record.date.split('T')[0] === todayString;
    }).length;

    

    console.log("totalPresentToday",totalPresentToday);
    console.log("totalStudents",totalStudents);
    console.log("todayString",todayString);
    
    

    const data = {
        labels: ['Total Students', 'Total Present Today'],
        datasets: [
            {
                label: 'Attendance Overview',
                data: [totalStudents, totalPresentToday],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)', // Color for Total Students
                    'rgba(153, 102, 255, 0.6)', // Color for Total Present Today
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="mt-4">
               <h2>Welcome {userInfo.user.username}</h2>
            </div>
            <div className="mt-6">
                <h2 className="text-xl font-semibold">Attendance Overview</h2>
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default AdminDashboard;
