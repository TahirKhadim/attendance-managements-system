import ViewUserReports from '@/components/user/ViewReport';
import { useGeneratereportMutation, useGetUserreportQuery } from '@/redux/api/reportApiSlice';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const GenerateUserReport = () => {
  const [userId, setUserId] = useState('');
  const [generateReport, { isLoading }] = useGeneratereportMutation();
  const [reportGenerated, setReportGenerated] = useState(false);

  // Use the hook with userId and skip when not needed
  const { data: reports, refetch } = useGetUserreportQuery(userId, { skip: !reportGenerated });

 
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await generateReport({ userId }).unwrap();
      toast.success('Report generated successfully!');
      setReportGenerated(true); // Trigger report fetching
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to generate report');
    }
  };

  // Refetch reports when a report is generated
  useEffect(() => {
    if (reportGenerated) {
      refetch();
    }
  }, [reportGenerated, refetch]);

  return (
    <div className='max-w-md mx-auto p-6 bg-white border rounded shadow-md'>
      <h1 className='text-2xl font-semibold text-center mb-4'>Generate User Report</h1>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder='Enter User ID'
          required
          className='border p-2 w-full mb-4'
        />
        <button type='submit' className='bg-blue-500 text-white p-2 w-full' disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Report'}
        </button>
      </form>

      {reportGenerated && reports && <ViewUserReports reports={reports} />}
    </div>
  );
};

export default GenerateUserReport;
