import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const AdminLayout = () => {
  const [open,setopen]=useState(false)
  return (
    <div className='min-h-screen w-full flex'>
        {/* admin sidebar */}
        <Sidebar open={open} setopen={setopen}/>
        <div className='flex flex-1 flex-col'>
            {/* admin header */}

            <Header setopen={setopen}/>

            <main className='flex-1  flex bg-muted/80 p-4 md:p-6'>
                <Outlet/>
            </main>
        </div>
    </div>
  )
}

export default AdminLayout