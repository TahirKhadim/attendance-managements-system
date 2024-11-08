import { USER_URL } from "../features/constants";
import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/users/login`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/users/register`,
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/users/logout`,
        method: "POST",
        body: data,
      }),
    }),
    updateInfo: builder.mutation({
      query: ({ data, id }) => ({
        url: `${USER_URL}/users/update-account/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    updatePassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: `${USER_URL}/users/change-password`,
        method: "POST",
        body: { oldpassword: oldPassword, newPassword },
      }),
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: `${USER_URL}/users/refresh-token`,
        method: "POST",
      }),
    }),

    getAllUsers: builder.query({
      query: () => ({
        url: `${USER_URL}/users/all-users`,
        method: "GET",
      }),
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USER_URL}/users/user/${id}`,
        method: "DELETE",
      }),
    }),

    updateUserRole: builder.mutation({
      query: ({ id, data }) => ({
        url: `${USER_URL}/users/info/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),

    changeAvatar: builder.mutation({
      query: (formData) => ({
        url: `${USER_URL}/users/avatar`, // Adjust as needed
        method: "PATCH",
        body: formData,
        // Don't set Content-Type; let the browser set it automatically
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useUpdateInfoMutation,
  useUpdatePasswordMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
  useChangeAvatarMutation,
} = userApiSlice;
