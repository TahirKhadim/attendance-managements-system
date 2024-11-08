import { USER_URL } from "../features/constants";
import { apiSlice } from "./apiSlice";

export const reportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generatereport: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/users/report`,
        method: "POST",
        body: data,
      }),
    }),

    generatesystemreport: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/users/system-report`,
        method: "POST",
        body: data,
      }),
    }),

    getUserreport: builder.query({
      query: (userId) => ({
        url: `${USER_URL}/users/report/${userId}`,
        method: "GET",
      }),
    }),

 
  }),
});

// Export hooks for usage in functional components
export const {
 useGeneratereportMutation,useGeneratesystemreportMutation,useGetUserreportQuery
} = reportApiSlice;
