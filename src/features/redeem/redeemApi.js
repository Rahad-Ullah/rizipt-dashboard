import { baseApi } from "../../utils/apiBaseQuery";

export const redeamApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Login
        getAllRedeem: builder.query({
            query: ({ searchTerm = "", page = 1, status = "pending" } = {}) => {
                const params = new URLSearchParams();
                if (searchTerm) params.append("searchTerm", searchTerm);
                if (page) params.append("page", page.toString());
                if (status) params.append("status", status); // pending / used
                return {
                    url: `/redeems/all?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["redeem"],
        }),
    }),
});

// Export hooks
export const {
    useGetAllRedeemQuery,
} = redeamApi;
