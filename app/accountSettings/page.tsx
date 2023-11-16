import { EditProfile } from '@/components/EditProfiles'
import React from 'react'

function accountSettings() {
  return (
    <div>
        <h2>Account Settings</h2>
        <div className='grid md:grid-cols-2 sm:grid-cols-1'>
          <EditProfile />
          <div>Edit pin</div>
          <div>Log out</div>
        </div>
        
    </div>
  )
}

export default accountSettings