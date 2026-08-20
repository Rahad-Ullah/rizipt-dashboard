import { baseApi } from "../../utils/apiBaseQuery";

export const offerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllOffers: builder.query({
            query: (params) => {
                const searchParams = new URLSearchParams();
                if (params?.searchTerm) searchParams.append("searchTerm", params.searchTerm);
                if (params?.status) searchParams.append("status", params.status);
                if (params?.page) searchParams.append("page", params.page);
                const queryString = searchParams.toString();
                return {
                    url: `/coupons/all${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["Offers"],
        }),

        deleteOffers: builder.mutation({
            query: (id) => ({
                url: `/coupons/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Offers"],
        }),
    }),
});

// Export hooks
export const {
    useGetAllOffersQuery,
    useDeleteOffersMutation,
} = offerApi;

