import AttendanceForm from '@/components/user/attendaceForm';

import { useMarkAttendanceMutation } from '@/redux/api/attendanceApiSlice';
import React, {  useState } from 'react';
import { toast } from 'react-toastify';


const Attendance = () => {
  


    const [markAttendance] = useMarkAttendanceMutation();
    const [attendanceRecords, setAttendanceRecords] = useState([]);

  

    const handleAttendanceSubmit = async (data) => {
        const currentDate = new Date().toISOString().split('T')[0];

        // Check if the user has already marked attendance for today
        const alreadyMarked = attendanceRecords.some(record => {
            const recordDate = new Date(record.date).toISOString().split('T')[0];
            return recordDate === currentDate;
        });

        if (alreadyMarked) {
            toast.error('You have already marked attendance for today.');
            return; // Prevent submission
        }

        try {
            const attendanceData = {
                status: data.status,
                date: currentDate,
                time: new Date().toLocaleTimeString()
            };

            // Mark attendance
            await markAttendance(attendanceData).unwrap();

            // Update attendance records after successful submission
            setAttendanceRecords(prevRecords => [
                ...prevRecords,
                { ...attendanceData, _id: new Date().getTime() } // Simulating an ID for the new record
            ]);
            toast.success('Attendance marked successfully!');

        } catch (err) {
            console.error('Failed to mark attendance: ', err);
            toast.error('Failed to mark attendance.');
        }
    };

    return (
        <div className='w-full mx-auto'>
            
            <AttendanceForm onSubmit={handleAttendanceSubmit} />
            
        </div>
    );
};

export default Attendance;
