import { baseApi } from "../../utils/apiBaseQuery";

export const overviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAll: builder.query({
            query: () => ({
                url: "/analytics/overview/admin",
                method: "GET",
            }),
            providesTags: ["Overview"],
        }),

        userGroth: builder.query({
            query: (year) => ({
                url: `/analytics/users-growth?year=${year}`,
                method: "GET",
            }),
            providesTags: ["Overview"],
        }),
    }),
});

export const {
    useGetAllQuery,
    useUserGrothQuery,
} = overviewApi;
