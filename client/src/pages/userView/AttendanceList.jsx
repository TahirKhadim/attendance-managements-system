import { useViewAttandanceQuery } from '@/redux/api/attendanceApiSlice';
import React from 'react';
import { useSelector } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment'; // Ensure you have moment.js for date handling
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useGetUserLeavesQuery } from '@/redux/api/leaveApiSlice';

const localizer = momentLocalizer(moment);

const AttendanceList = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo.user?._id;

  const { data: attendanceData, isLoading, error } = useViewAttandanceQuery(userId);

  const { data: userLeaves } = useGetUserLeavesQuery(userId);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;



  const approvedLeaves = userLeaves?.data.filter(leave => leave.status === 'approved') || [];
  

  // Map attendance data to the format required by the calendar
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
  }).concat(approvedLeaves.map(leave => {
      return {
          id: leave._id,
          title: 'On Leave',
          start: new Date(leave.startDate),
          end: new Date(leave.endDate),
      };
  }))
  : [];

return (
  <div className='w-full mx-auto '>
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
  
export default AttendanceList;
