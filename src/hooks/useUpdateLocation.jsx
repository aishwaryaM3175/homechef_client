import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import {  setCurrentAddress, setCurrentCity, setCurrentState, setUserData } from '../redux/userSlice'
import { setFullAddress, setLocation } from '../redux/mapSlice'

function useUpdateLocation() {
    const dispatch=useDispatch()
    const {userData}=useSelector(state=>state.user)
 
    useEffect(()=>{
        if(!userData) return // Only run if user is logged in
        
        if(!navigator.geolocation){
            console.log("Geolocation is not supported")
            return
        }
        
const updateLocation=async (lat,lon) => {
    try {
        const result=await axios.post(`${serverUrl}/api/user/update-location`,{lat,lon},{withCredentials:true})
        console.log(result.data)
    } catch (error) {
        console.log("Error updating location:", error)
    }
}

const watchId = navigator.geolocation.watchPosition(
    (pos)=>{
        updateLocation(pos.coords.latitude,pos.coords.longitude)
    },
    (error)=>{
        console.log("Geolocation watch error:", error)
    }
)

return () => {
    if(watchId) {
        navigator.geolocation.clearWatch(watchId)
    }
}
    },[userData])
}

export default useUpdateLocation
