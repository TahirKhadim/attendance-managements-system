import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button'; 
import { useGetAllUsersQuery, useDeleteUserMutation, useUpdateUserRoleMutation } from '@/redux/api/userApiSlice';
import { useViewAttandanceQuery } from '@/redux/api/attendanceApiSlice';
import { useNavigate } from 'react-router-dom';


const UserManagement = () => {
  const navigate=useNavigate()
  const { data: users, error, isLoading, refetch } = useGetAllUsersQuery();
  const userArray = users?.data || [];

  const [deleteUser] = useDeleteUserMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [attendanceUserId, setAttendanceUserId] = useState(null); // Track which user's attendance to fetch
  const { data: attendanceData } = useViewAttandanceQuery(attendanceUserId, {
    skip: !attendanceUserId // Skip fetching if no user ID is set
  });

  const [editableUser, setEditableUser] = useState(null);
  const [userData, setUserData] = useState({ username: '', email: '', isAdmin: false });

  useEffect(() => {
    if (error) {
      toast.error(`Error loading users: ${error.message}`);
    }
  }, [error]);

  const handleEditClick = (user) => {
    setEditableUser(user);
    setUserData({ username: user.username, email: user.email, isAdmin: user.isAdmin });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await updateUserRole({ id: editableUser._id, data: userData }).unwrap();
      toast.success('User updated successfully!');
      setEditableUser(null);
      setUserData({ username: '', email: '', isAdmin: false });
      refetch();
    } catch (error) {
      toast.error(`Error updating user: ${error.message}`);
    }
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.username}?`)) {
      try {
        await deleteUser(user._id).unwrap();
        toast.success(`${user.username} deleted successfully!`);
        refetch();
      } catch (error) {
        toast.error(`Error deleting user: ${error.message}`);
      }
    }
  };

  const handleToggleAdmin = () => {
    setUserData((prevData) => ({ ...prevData, isAdmin: !prevData.isAdmin }));
  };

  const handleViewAttendance = (userId) => {
    navigate(`/admin/view-attendance/${userId}`); // Navigate to the AttendanceList with userId
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded">
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>

      {userArray && userArray.length > 0 ? (
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Username</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Role</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userArray.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{user.username}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">
                  {user.isAdmin ? 'Admin' : 'User'}
                  <Button 
                    onClick={handleToggleAdmin} 
                    className={`ml-2 ${user.isAdmin ? 'bg-red-500' : 'bg-green-500'} text-white`}
                  >
                    {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                  </Button>
                </td>
                <td className="border border-gray-300 p-2 flex">
                  <Button
                    onClick={() => handleEditClick(user)}
                    className="bg-yellow-500 text-white mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteUser(user)}
                    className="bg-red-500 text-white mr-2"
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() => handleViewAttendance(user._id)}
                    className="bg-blue-500 text-white"
                  >
                    View Attendance
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-gray-600">No users found.</div>
      )}

      {/* Edit User Form */}
      {editableUser && (
        <div className="mb-4 p-4 border rounded bg-gray-100 mt-4">
          <h3 className="text-xl mb-2">Edit User</h3>
          <form onSubmit={handleUpdateUser}>
            <div className="mb-4">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={userData.username}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                required
                className="mt-1 border p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                required
                className="mt-1 border p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label>
                <input
                  type="checkbox"
                  checked={userData.isAdmin}
                  onChange={handleToggleAdmin}
                />
                Admin
              </label>
            </div>
            <Button type="submit" className="bg-blue-500 text-white">
              Update User
            </Button>
            <Button 
              onClick={() => setEditableUser(null)} 
              className="bg-gray-500 text-white ml-2"
            >
              Cancel
            </Button>
          </form>
        </div>
      )}

      {/* Attendance Data Display */}
      {attendanceData && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h3 className="text-xl mb-2">Attendance Data</h3>
          <pre>{JSON.stringify(attendanceData, null, 2)}</pre>
          <Button onClick={() => setAttendanceUserId(null)} className="bg-gray-500 text-white">
            Close
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
