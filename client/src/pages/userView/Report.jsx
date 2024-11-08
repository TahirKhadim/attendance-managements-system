import { useViewReportQuery } from '@/redux/api/attendanceApiSlice';
import React from 'react';
import { useSelector } from 'react-redux';

const AttendanceReport = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo.user._id;

  const { data: report, error, isLoading } = useViewReportQuery(userId);

  // Loading state
  if (isLoading) return <div>Loading...</div>;

  // Error handling
  if (error) {
    console.error("Error fetching attendance report:", error);
    return <div>Error: {error.message}</div>;
  }

  // Check if report is defined and has the expected structure
  const reportArray = report ? report.data : {}; // Safely access data

  return (
    <div>
      
      <div className='max-w-full w-[40rem] flex flex-col items-center'>
        <p>Total Attendance: {reportArray.totalAttendance || 0}</p>
        <p>Present Count: {reportArray.presentCount || 0}</p>
        <p>Absent Count: {reportArray.absentCount || 0}</p>
        <p>Leave Count: {reportArray.leaveCount || 0}</p>
        <p>Attendance Rate: {(reportArray.attendanceRate || 0).toFixed(2)}%</p>
      </div>
    </div>
  );
};

export default AttendanceReport;
