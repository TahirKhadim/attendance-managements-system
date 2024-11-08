import { useViewAttandanceQuery } from '@/redux/api/attendanceApiSlice';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment'; 
import 'react-big-calendar/lib/css/react-big-calendar.css';


const localizer = momentLocalizer(moment);

const UserAttendanceList = () => {
  const { userId } = useParams(); // Get userId from the URL

 const navigate=useNavigate()
  

  const { data: attendanceData, isLoading, error } = useViewAttandanceQuery(userId);
  
  
  if (isLoading) return <p>Loading...</p>;
  if (error) {
    return <p>Error: {error.status === 404 ? "User not found or no attendance records available." : error.message}</p>;
  }

  const events = attendanceData
    ? attendanceData.data.map(entry => {
        const dateObject = new Date(entry.date);
        const timeString = dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        
        return {
          id: entry._id,
          title: `${entry.status} at ${timeString}`,
          start: dateObject,
          end: dateObject,
        };
      })
    : [];

   
  return (
    <div className='w-full mx-auto'>
      
      <h1>Attendance Records</h1>
      <div style={{ width: '100%', margin: 'auto' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600, margin: '50px' }}
          views={['month']}
          defaultView='month'
          popup
        />
      </div>
     
    </div>
  );
};

export default UserAttendanceList;
