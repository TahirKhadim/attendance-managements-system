import { useGeneratesystemreportMutation } from '@/redux/api/reportApiSlice';
import React from 'react';

import { toast } from 'react-toastify';

const GenerateSystemReport = () => {
  const [generateSystemReport, { isLoading }] = useGeneratesystemreportMutation();

  const handleGenerate = async () => {
    try {
      const res=await generateSystemReport({}).unwrap(); 
      console.log(res);
      
      toast.success('System report generated successfully!');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to generate system report');
    }
  };

  return (
    <div className='max-w-md mx-auto p-6 bg-white border rounded shadow-md'>
      <h1 className='text-2xl font-semibold text-center mb-4'>Generate System Report</h1>
      <button
        onClick={handleGenerate}
        className='bg-blue-500 text-white p-2 w-full'
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate System Report'}
      </button>
    </div>
  );
};

export default GenerateSystemReport;
