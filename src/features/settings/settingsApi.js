import { baseApi } from "../../utils/apiBaseQuery";

export const settingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createSettings: builder.mutation({
            query: (data) => ({
                url: "/disclaimers",
                method: "POST",
                body: data, // { type: "terms_of_service" | "privacy_policy" | "about_us", content: "..." }
            }),
            invalidatesTags: ["settings"],
        }),

        getSettings: builder.query({
            query: (type) => ({
                url: `/disclaimers/${type}`, // terms_of_service / privacy_policy / about_us
                method: "GET",
            }),
            providesTags: ["settings"],
        }),
    }),
});

export const {
    useCreateSettingsMutation,
    useGetSettingsQuery,
} = settingsApi;
