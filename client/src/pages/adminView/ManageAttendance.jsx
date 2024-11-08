import { useDeleteAttendanceMutation, useUpdateAttendanceMutation, useViewAllAttandanceQuery } from '@/redux/api/attendanceApiSlice';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';

const ManageAttendance = () => {
  const [attendanceData, setAttendanceData] = useState({ status: '', date: '' });
  const [updateId, setUpdateId] = useState(null);
  const { data: attendanceRecords, error: fetchError, refetch } = useViewAllAttandanceQuery();
  
  const attendanceArray = attendanceRecords?.data || [];

  // console.log(attendanceArray);
  
  
  const [updateAttendance] = useUpdateAttendanceMutation();
  const [deleteAttendance] = useDeleteAttendanceMutation();

  const handleUpdateAttendance = async (e) => {
    e.preventDefault();
    
   
  
    if (!updateId) {
      toast.error("No attendance record selected for update.");
      return;
    }
  
    try {
      await updateAttendance({ id: updateId, ...attendanceData }).unwrap(); // Pass ID within the data
      toast.success("Attendance updated successfully!");
      resetForm();
      refetch(); 
    } catch (error) {
      const errorMessage = error?.data?.message || error.message || "Error updating attendance";
      toast.error(`Error updating attendance: ${errorMessage}`);
    }
  };
  

  const handleDeleteAttendance = async (id) => {
    try {
      await deleteAttendance(id).unwrap();
      toast.success("Attendance deleted successfully!");
      refetch(); 
    } catch (error) {
      toast.error(`Error deleting attendance: ${error.message}`);
    }
  };

  const resetForm = () => {
    setAttendanceData({ status: '', date: '' });
    setUpdateId(null);
  };

  const handleEditClick = (record) => {
    console.log("Editing record:", record); 
    setAttendanceData({ status: record.status, date: record.date });
    setUpdateId(record._id); 
  };

  useEffect(() => {
    if (fetchError) {
      toast.error(`Error loading attendance records: ${fetchError.message}`);
    }
  }, [fetchError]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded">
      

     

      {/* Update Form */}
      {updateId && (
        <div className="mb-4 p-4 border rounded bg-gray-100">
          <h3 className="text-xl mb-2">Update Attendance</h3>
          <form onSubmit={handleUpdateAttendance}>
            <div className="mb-4">
              <label htmlFor="">Date</label>
              <input
                type="date"
                value={attendanceData.date}
                onChange={(e) => setAttendanceData({ ...attendanceData, date: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="">Status</label>
              <select
                value={attendanceData.status}
                onChange={(e) => setAttendanceData({ ...attendanceData, status: e.target.value })}
                className="border p-2 mt-1 w-full"
                required
              >
                <option value="">Select Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
            </div>
            <Button type="submit" className="bg-blue-500 text-white">
              Save
            </Button>
          </form>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">Attendance Records</h2>
      {attendanceArray.length > 0 ? (
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">StudentId</th>
             
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendanceArray.map((record) => (
              <tr key={record._id} className="border-b hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{record.userId?.username}</td>
               
                <td className="border border-gray-300 p-2">{new Date(record.date).toLocaleDateString()}</td>
                <td className="border border-gray-300 p-2">{record.status}</td>
                <td className="border border-gray-300 p-2 flex">
                  <Button
                    onClick={() => handleEditClick(record)}
                    className="bg-yellow-500 text-white mr-2"
                  >
                    Update
                  </Button>
                  <Button
                    onClick={() => handleDeleteAttendance(record._id)}
                    className="bg-red-500 text-white"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-gray-600">No attendance records found.</div>
      )}
    </div>
  );
};

export default ManageAttendance;
