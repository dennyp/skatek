import { apiSlice } from '../api/apiSlice'

export const productsApiSlice = apiSlice.injectEndpoints({
  tagTypes: ['Products', 'Product'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: '/products',
        method: 'GET',
      }),
      providesTags: ['Products'],
    }),
    getProductsWithSearch: builder.query({
      query: ({ search, filter }) => ({
        url: '/products',
        method: 'GET',
        params: { search, filter },
      }),
      providesTags: ['Products'],
    }),
    getProduct: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'GET',
      }),
      providesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: (product) => ({
        url: `/products/${product._id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: ['Products', 'Product'],
    }),
    createProduct: builder.mutation({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Products'],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetProductsWithSearchQuery,
  useGetProductQuery,
  useUpdateProductMutation,
  useCreateProductMutation,
} = productsApiSlice
