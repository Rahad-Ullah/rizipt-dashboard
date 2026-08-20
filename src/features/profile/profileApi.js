import { baseApi } from "../../utils/apiBaseQuery";

export const profileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        updateMyProfile: builder.mutation({
            query: (data) => ({
                url: "/users/profile",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["profile"],
        }),

        getMyProfile: builder.query({
            query: () => ({
                url: "/users/profile",
                method: "GET",
            }),
            providesTags: ["profile"],
        }),

        changeMyPassword: builder.mutation({
            query: (data) => ({
                url: "/auth/change-password",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["profile"],
        }),

        uploadImage: builder.mutation({
            query: (data) => ({
                url: "/media-uploads/upload",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["profile"],
        }),

    }),
});

export const {
    useUpdateMyProfileMutation,
    useGetMyProfileQuery,
    useChangeMyPasswordMutation,
    useUploadImageMutation,
} = profileApi;
