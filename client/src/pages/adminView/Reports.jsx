import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'

const Reports = () => {
  return (
    <div className='flex gap-4 flex-col md:flex-row'>
      <Link to={'/admin/generate-user-report'}><Button>Gnerate User Specific Report</Button></Link>
      <Link to={'/admin/generate-system-report'}><Button>Gnerate System Specific Report</Button></Link>
      
      
    </div>
  )
}

export default Reports