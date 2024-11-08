import { useGetUserLeavesQuery } from '@/redux/api/leaveApiSlice';
import React from 'react';
import { useSelector } from 'react-redux';

const ViewLeave = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const userId = userInfo.user?._id;

    const { data: userLeaves, isLoading: loadingLeaves, isError } = useGetUserLeavesQuery(userId);

    if (loadingLeaves) {
        return <div className="text-center text-gray-700">Loading your leave requests...</div>;
    }

    if (isError) {
        return <div className="text-center text-red-600">Error loading leave requests.</div>;
    }

    const leaveArray = userLeaves?.data || [];

    return (
        <div className='max-w-md mx-auto p-6 bg-white border rounded shadow-md'>
            <h1 className='text-2xl font-semibold text-center mb-4'>Your Leave Requests</h1>

            {leaveArray.length > 0 ? (
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100 ">
                            <th className="border border-gray-300 p-2 text-left">Reason</th>
                            <th className="border border-gray-300 p-2 text-left">Start Date</th>
                            <th className="border border-gray-300 p-2 text-left">End Date</th>
                            <th className="border border-gray-300 p-2 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaveArray.map((leave) => (
                            <tr key={leave._id} className="border-b hover:bg-gray-50">
                                <td className="border border-gray-300 p-2">{leave.reason}</td>
                                <td className="border border-gray-300 p-2">{new Date(leave.startDate).toLocaleDateString()}</td>
                                <td className="border border-gray-300 p-2">{new Date(leave.endDate).toLocaleDateString()}</td>
                                <td className="border border-gray-300 p-2">{leave.status}</td>
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

export default ViewLeave;
