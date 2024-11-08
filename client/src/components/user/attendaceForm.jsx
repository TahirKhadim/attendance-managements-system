import React from 'react';
import { useForm } from 'react-hook-form';

const AttendanceForm = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onFormSubmit = async (data) => {
    const today = new Date().toISOString().split('T')[0];

    // Check if the submitted date is today
    if (data.date !== today) {
      alert("You cannot mark attendance for a date other than today.");
      return; // Prevent form submission
    }

    // Call the onSubmit function and handle the response
    try {
      await onSubmit(data);
    } catch (err) {
      if (err.message === "Attendance for this date already recorded") {
        alert("You have already marked attendance for today.");
      }
    }
  };

  return (
    <form 
      onSubmit={handleSubmit(onFormSubmit)} 
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold mb-4">Mark Attendance</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Status (e.g., Present/Absent)</label>
        <input 
          type="text" 
          placeholder="Status" 
          {...register('status', { required: true })} 
          className={`border rounded w-full py-2 px-3 text-gray-700 ${
            errors.status ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.status && <span className="text-red-500 text-sm">Status is required</span>}
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Date</label>
        <input 
          type="date" 
          {...register('date', { required: true })} 
          className={`border rounded w-full py-2 px-3 text-gray-700 ${
            errors.date ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.date && <span className="text-red-500 text-sm">Date is required</span>}
      </div>
      
      <button 
        type="submit" 
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 rounded transition duration-200"
      >
        Submit
      </button>
    </form>
  );
};

export default AttendanceForm;
