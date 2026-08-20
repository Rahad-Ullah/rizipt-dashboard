import { baseApi } from "../../utils/apiBaseQuery";
import { io } from "socket.io-client";
import { baseURL } from "../../utils/BaseURL";
import { getToken } from "../../utils/storage";

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllNotification: builder.query({
            query: (params) => ({
                url: "/notifications/me",
                method: "GET",
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                },
            }),
            providesTags: ["notification"],
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
            ) {
                let socket;
                try {
                    await cacheDataLoaded;
                    const token = getToken();

                    socket = io(baseURL, {
                        auth: { token },
                        query: { token },
                        transports: ["websocket", "polling"],
                        reconnection: true,
                        reconnectionAttempts: 5,
                    });

                    socket.on("connect", () => {
                        console.log("Socket connected successfully for notifications:", socket.id);
                    });

                    // Listen to getNotification event
                    socket.on("getNotification", (newNotification) => {
                        console.log("Realtime getNotification event received:", newNotification);

                        // Invalidate notification tag so all components re-fetch fresh data
                        dispatch(baseApi.util.invalidateTags(["notification"]));

                        // Optimistically update cache data
                        updateCachedData((draft) => {
                            if (draft?.data?.data && Array.isArray(draft.data.data)) {
                                if (newNotification && typeof newNotification === "object") {
                                    // Avoid duplicates if already present
                                    const exists = draft.data.data.some(
                                        (item) => item._id === newNotification._id
                                    );
                                    if (!exists) {
                                        draft.data.data.unshift(newNotification);
                                        if (typeof draft.data.unreadCount === "number") {
                                            draft.data.unreadCount += 1;
                                        }
                                    }
                                }
                            }
                        });
                    });

                    socket.on("connect_error", (err) => {
                        console.warn("Socket notification connect error:", err.message);
                    });

                } catch (error) {
                    console.error("Cache data error in notification socket:", error);
                }

                await cacheEntryRemoved;
                if (socket) {
                    socket.disconnect();
                }
            },
        }),

        readSingleNotification: builder.mutation({
            query: (id) => ({
                url: `/notifications/read/${id}`,
                method: "POST",
            }),
            invalidatesTags: ["notification"],
        }),

        readAllNotification: builder.mutation({
            query: () => ({
                url: "/notifications/read-all",
                method: "POST",
            }),
            invalidatesTags: ["notification"],
        }),
    }),
});

export const {
    useGetAllNotificationQuery,
    useReadSingleNotificationMutation,
    useReadAllNotificationMutation,
} = notificationApi;
