import React from 'react'
import { useSelector } from 'react-redux'
import UserDashboard from '../components/UserDashboard'
import OwnerDashboard from '../components/OwnerDashboard'
import DeliveryBoy from '../components/DeliveryBoy'
import PublicHome from '../components/PublicHome'
import { useLocation } from 'react-router-dom';

function Home() {
    const {userData}=useSelector(state=>state.user)
  // This override shows PublicHome when coming from logo click
const location = useLocation();
if (location.state?.fromLogo) {
  return <PublicHome />;
}

  // If user is not logged in, show public homepage
  if (!userData) {
    return <PublicHome />
  }

  // If user is logged in, show appropriate dashboard based on role
  return (
    <div className='w-[100vw] min-h-[100vh] pt-[100px] flex flex-col items-center bg-[#fff9f6]'>
      {userData.role=="user" && <UserDashboard/>}
      {userData.role=="owner" && <OwnerDashboard/>}
      {userData.role=="deliveryBoy" && <DeliveryBoy/>}
    </div>
  )
}

export default Home
