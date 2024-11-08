import React, { useEffect, useState } from 'react';
import { useGetAllLeavesQuery, useUpdateLeaveStatusMutation, useDeleteLeaveMutation } from '@/redux/api/leaveApiSlice';
import { toast } from 'react-toastify';

const LeaveApproval = () => {
    const { data: leaves, isLoading, isError, error, refetch } = useGetAllLeavesQuery();
    const leavesArray = leaves?.data || [];
    
    const [updateLeaveStatus] = useUpdateLeaveStatusMutation();
    const [deleteLeave] = useDeleteLeaveMutation();
    
    
    const [actionTriggered, setActionTriggered] = useState(false);

    const handleUpdateStatus = async (id, status) => {
        try {
            const res = await updateLeaveStatus({ id, status });
            if (res.error) {
                throw new Error(res.error.message);
            }
            toast.success(`Leave request ${status === 'approved' ? 'approved' : 'rejected'} successfully!`);
            setActionTriggered(prev => !prev); 
        } catch (err) {
            toast.error(`Error updating leave status: ${err.message}`);
        }
    };

    const handleDeleteLeave = async (id) => {
        try {
            const res = await deleteLeave(id);
            if (res.error) {
                throw new Error(res.error.message);
            }
            toast.success('Leave request deleted successfully!');
            setActionTriggered(prev => !prev);
        } catch (err) {
            toast.error(`Error deleting leave request: ${err.message}`);
        }
    };

    useEffect(() => {
        if (actionTriggered) {
            refetch(); 
            setActionTriggered(false); 
        }
    }, [actionTriggered, refetch]);

    if (isLoading) {
        return <div className="text-center text-gray-700">Loading leave requests...</div>;
    }

    if (isError) {
        console.error('Error fetching leave requests:', error);
        return <div className="text-red-600">Error loading leave requests: {error.message}</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded">
            <h1 className="text-3xl font-bold mb-6">Leave Requests Management</h1>

            {leavesArray.length > 0 ? (
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-left">User ID</th>
                            <th className="border border-gray-300 p-2 text-left">Reason</th>
                            <th className="border border-gray-300 p-2 text-left">Start Date</th>
                            <th className="border border-gray-300 p-2 text-left">End Date</th>
                            <th className="border border-gray-300 p-2 text-left">Status</th>
                            <th className="border border-gray-300 p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leavesArray.map((leave) => (
                            <tr key={leave._id} className="border-b hover:bg-gray-50">
                                <td className="border border-gray-300 p-2">{leave.userId}</td>
                                <td className="border border-gray-300 p-2">{leave.reason}</td>
                                <td className="border border-gray-300 p-2">{new Date(leave.startDate).toLocaleDateString()}</td>
                                <td className="border border-gray-300 p-2">{new Date(leave.endDate).toLocaleDateString()}</td>
                                <td className="border border-gray-300 p-2">{leave.status}</td>
                                <td className="border border-gray-300 p-2">
                                    <button
                                        onClick={() => handleUpdateStatus(leave._id, leave.status === 'approved' ? 'rejected' : 'approved')}
                                        className="mr-2 bg-blue-500 text-white p-1 rounded"
                                    >
                                        {leave.status === 'approved' ? 'Reject' : 'Approve'}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteLeave(leave._id)}
                                        className="bg-red-500 text-white p-1 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-center text-gray-600">No leave requests found.</div>
            )}
        </div>
    );
};

export default LeaveApproval;
