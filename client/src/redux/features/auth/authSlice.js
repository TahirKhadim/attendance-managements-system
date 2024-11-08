import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      console.log('User info set in state:', state.userInfo);
      localStorage.setItem("userInfo", JSON.stringify(action.payload));

      // Calculate expiration time for 30 days from now
      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem("expirationTime", expirationTime);
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.clear(); // Clear all localStorage data
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
