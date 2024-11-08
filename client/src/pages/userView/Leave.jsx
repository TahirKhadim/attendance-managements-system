import { Button } from '@/components/ui/button';
import {  useReqLeaveMutation } from '@/redux/api/leaveApiSlice';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';


const Leave = () => {
  const { register, handleSubmit, reset } = useForm();

  const [reqLeave, { isLoading: submittingLeave }] = useReqLeaveMutation();

  const onSubmit = async (data) => {
    try {
      await reqLeave(data).unwrap();
      reset(); 
      alert('Leave request submitted successfully!');
    } catch (error) {
      console.error('Failed to submit leave request:', error);
      alert('Failed to submit leave request. Please try again.');
    }
  };



  return (
    <div className='max-w-md mx-auto p-6 bg-white border rounded shadow-md'>
      <h1 className='text-2xl font-semibold text-center mb-4'>Request Leave</h1>
      <Link to={'/user/view-leave'}><Button>view leave request</Button></Link>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-group">
          <label className="block font-medium mb-1">Start Date:</label>
          <input
            type="date"
            {...register('startDate', { required: true })}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="form-group">
          <label className="block font-medium mb-1">End Date:</label>
          <input
            type="date"
            {...register('endDate', { required: true })}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="form-group">
          <label className="block font-medium mb-1">Reason:</label>
          <textarea
            {...register('reason', { required: true })}
            className="w-full p-2 border border-gray-300 rounded"
            rows="4"
          />
        </div>
        <button
          type="submit"
          disabled={submittingLeave}
          className={`w-full p-2 text-white rounded ${
            submittingLeave ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {submittingLeave ? 'Submitting...' : 'Submit Leave Request'}
        </button>
      </form>

    
   
    </div>
  );
};

export default Leave;
