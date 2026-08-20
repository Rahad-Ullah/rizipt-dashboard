import { baseApi } from "../../utils/apiBaseQuery";

export const faqApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllFaq: builder.query({
            query: () => ({
                url: "/faqs",
                method: "GET",
            }),
            providesTags: ["Faq"],
        }),

        getFaqById: builder.query({
            query: (id) => ({
                url: `/faqs/${id}`,
                method: "GET",
            }),
            providesTags: ["Faq"],
        }),

        createFaq: builder.mutation({
            query: (data) => ({
                url: "/faqs/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Faq"],
        }),

        updateFaq: builder.mutation({
            query: ({ id, data }) => ({
                url: `/faqs/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Faq"],
        }),

        deleteFaq: builder.mutation({
            query: (id) => ({
                url: `/faqs/${id}`,
                method: "DELETE",
                body: {},
            }),
            invalidatesTags: ["Faq"],
        }),
    }),
});

export const {
    useGetAllFaqQuery,
    useGetFaqByIdQuery,
    useCreateFaqMutation,
    useUpdateFaqMutation,
    useDeleteFaqMutation,
} = faqApi;
