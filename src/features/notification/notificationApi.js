import { baseApi } from "../../utils/apiBaseQuery";

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getAllNotification: builder.query({
            query: (params = {}) => {
                const page = typeof params === "object" ? params?.page || 1 : params || 1;
                const limit = typeof params === "object" ? params?.limit || 10 : 10;
                return {
                    url: `/notifications/me?page=${page}&limit=${limit}`,
                    method: "GET",
                };
            },
            providesTags: ["notification"],
        }),

        readAllNotification: builder.mutation({
            query: () => ({
                url: `/notifications/read-all`,
                method: "PATCH",
            }),
            invalidatesTags: ["notification"],
        }),

        readSingleNotification: builder.mutation({
            query: (id) => ({
                url: `/notifications/read/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["notification"],
        }),

    }),
});

export const {
    useReadSingleNotificationMutation,
    useGetAllNotificationQuery,
    useReadAllNotificationMutation,
} = notificationApi;
