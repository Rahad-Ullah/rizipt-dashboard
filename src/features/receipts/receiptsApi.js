import { baseApi } from "../../utils/apiBaseQuery";

export const receiptsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllReceipts: builder.query({
            query: ({ searchTerm = "", page = 1, status = "", folder = "" } = {}) => {
                const params = new URLSearchParams();
                if (searchTerm) params.append("searchTerm", searchTerm);
                if (page) params.append("page", page.toString());
                if (status) params.append("status", status); // draft / sent
                if (folder) params.append("folder", folder);
                const queryString = params.toString();
                return {
                    url: `/receipts/all${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["Receipts"],
        }),
    }),
});

// Export hooks
export const {
    useGetAllReceiptsQuery,
} = receiptsApi;
