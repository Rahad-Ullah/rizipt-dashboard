import { baseApi } from "../../utils/apiBaseQuery";

export const usersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: ({ searchTerm = "", role = "user", status = "", page = 1 } = {}) => {
                const params = new URLSearchParams();
                if (searchTerm) params.append("searchTerm", searchTerm);
                if (role) params.append("role", role);
                if (status) params.append("status", status);
                if (page) params.append("page", page.toString());
                return {
                    url: `/users/all?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["Users"],
        }),

        getSingleUser: builder.query({
            query: (id) => ({
                url: `/users/single/${id}`,
                method: "GET",
            }),
            providesTags: ["Users"],
        }),

        updateStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/users/status/${id}`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Users"],
        }),
    }),
});

// Export hooks
export const {
    useGetAllUsersQuery,
    useGetSingleUserQuery,
    useUpdateStatusMutation,
} = usersApi;

