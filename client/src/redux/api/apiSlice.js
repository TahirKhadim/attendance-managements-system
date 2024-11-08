import {fetchBaseQuery,createApi} from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../features/constants';


const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accesstoken'); // Fetch the token from local storage
      
  
      if (token) {
        headers.set('Authorization', `Bearer ${token}`); 
      }
      return headers;
    },
  });

export const apiSlice=createApi({
    
    baseQuery,
    tagTypes:["leave","attandance"],
    endpoints:()=>({})
})