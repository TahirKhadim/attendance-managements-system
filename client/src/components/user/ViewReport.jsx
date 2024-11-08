import React from 'react';

const ViewUserReports = ({ reports }) => {
  
  
  if (!reports || reports.length === 0) return <p>No reports found.</p>;

 
  const processAttendanceData = (attendanceRecords) => {
    const today = new Date();
    let presentCount = 0;
    let leaveCount = 0;
    

    attendanceRecords.forEach(record => {
      const recordDate = new Date(record.date);
      
      // Check if the record is today or earlier
      if (recordDate <= today) {
        if (record.status === "Present") {
          presentCount++;
        } else if (record.status === "Leave") {
          leaveCount++;
        }
      }
    });

    return {
      totalDays: attendanceRecords.length,
      presentCount,
      leaveCount,
      daysUntilToday: Math.ceil((today - new Date(attendanceRecords[0].date)) / (1000 * 60 * 60 * 24)),
      
    };
  };

  const attendanceRecords = reports[0]?.attendanceData || [];
  const {
    totalDays,
    presentCount,
    leaveCount,
    daysUntilToday,
   
  } = processAttendanceData(attendanceRecords);

  const AbsentCount=daysUntilToday-(presentCount+leaveCount);

  return (
    <div className='mt-4'>
      <h2 className='text-xl font-semibold'>Generated Reports</h2>
      <ul>
        {reports.map((report) => (
          <li key={report._id} className='border-b p-2'>
            Report ID: {report._id} | Generated At: {new Date(report.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>

      <div className='mt-4'>
        <h3 className='text-lg font-semibold'>Attendance Summary</h3>
        <p>Total Days Recorded: {totalDays}</p>
        <p>Days Until Today: {daysUntilToday}</p>
        <p>Number of Present Days: {presentCount}</p>
        <p>Number of Leave Days: {leaveCount}</p>
        <p>Number of Absent Days: {AbsentCount}</p>
      </div>
    </div>
  );
};

export default ViewUserReports;
