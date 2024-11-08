import { USER_URL } from "../features/constants";
import { apiSlice } from "./apiSlice";

export const attendanceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    markAttendance: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/users/attendance`,
        method: "POST",
        body: data,
      }),
    }),

    updateAttendance: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${USER_URL}/users/attendance/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteAttendance: builder.mutation({
      query: (id) => ({
        url: `${USER_URL}/users/attendance/${id}`,
        method: "Delete",
      }),
    }),

    viewAttandance: builder.query({
      query: (id) => ({
        url: `${USER_URL}/users/view-attendance/${id}`, 

      
        method: "GET",
      }),
    }),
    viewReport: builder.query({
      query: (id) => ({
        url: `${USER_URL}/users/attendance-report/${id}`, 

      
        method: "GET",
      }),
    }),
    viewAllAttandance: builder.query({
      query: () => ({
        url: `${USER_URL}/users/view-all-attendance`, 
        method: "GET",
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useViewAttandanceQuery,
  useMarkAttendanceMutation,
  useDeleteAttendanceMutation,
  useUpdateAttendanceMutation,
  useViewAllAttandanceQuery,
  useViewReportQuery,
} = attendanceApiSlice;
