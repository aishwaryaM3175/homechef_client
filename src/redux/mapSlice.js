import { createSlice } from "@reduxjs/toolkit";

const mapSlice = createSlice({
  name: "map",
  initialState: {
    location: { lat: null, lon: null },
    fullAddress: null,
  },
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setFullAddress: (state, action) => {
      state.fullAddress = action.payload;
    }
  }
});

export const { setLocation, setFullAddress } = mapSlice.actions;
export default mapSlice.reducer;
