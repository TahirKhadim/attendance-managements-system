import { USER_URL } from "../features/constants";
import { apiSlice } from "./apiSlice";

export const leaveApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reqLeave: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/users/leave`,
        method: "POST",
        body: data,
      }),
    }),

    getUserLeaves: builder.query({
      query: ({id}) => ({
        url: `${USER_URL}/users/leave/${id}`,
        method: "GET",
      }),
    }),

    getAllLeaves: builder.query({
      query: () => ({
        url: `${USER_URL}/users/admin/leaves`,
        method: "GET",
      }),
    }),

    updateLeaveStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${USER_URL}/users/admin/leaves/${id}/status`,
        method: "PUT",
        body: { status },
      }),
    }),

    deleteLeave: builder.mutation({
      query: (id) => ({
        url: `${USER_URL}/users/admin/leaves/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useReqLeaveMutation,
  useGetUserLeavesQuery,
  useGetAllLeavesQuery,
  useUpdateLeaveStatusMutation,
  useDeleteLeaveMutation,
} = leaveApiSlice;
