import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {  
  setCurrentAddress, 
  setCurrentCity, 
  setCurrentState
} from '../redux/userSlice';

import { setLocation, setFullAddress } from "../redux/mapSlice";

function useGetCity() {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);
  const apiKey = import.meta.env.VITE_GEOAPIKEY;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Save lat-lon to Redux
        dispatch(setLocation({ lat: latitude, lon: longitude }));

        // Reverse Geoapify API
        const result = await axios.get(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`
        );

        const data = result.data.features[0].properties;

        // Save city, state, address to Redux
        dispatch(setCurrentCity(data.city || data.county));
        dispatch(setCurrentState(data.state));
        dispatch(setCurrentAddress(data.address_line2 || data.address_line1));

        // Save full address
        dispatch(setFullAddress(data.formatted));

      } catch (err) {
        console.log("Location error:", err);
      }
    });
  }, [userData]);
}

export default useGetCity;
