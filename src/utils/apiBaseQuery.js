import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from './BaseURL';
import { getToken, removeToken } from './storage';
import { logout } from '../features/auth/authSlice';
import { toast } from 'react-hot-toast';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${baseURL}/api/v1`,
  prepareHeaders: (headers) => {
    if (!headers.has("Authorization")) {
      const token = getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return headers;
  },
});

const baseQueryWithAuthInterceptor = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;
    if (status === 401 || status === 403) {
      if (typeof window !== "undefined") {
        removeToken();
        api.dispatch(logout());
        toast.error("Session expired, please login again", { id: "session-expired" });
        if (!window.location.pathname.startsWith("/auth")) {
          window.location.href = "/auth/login?reason=expired";
        }
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithAuthInterceptor,
  endpoints: () => ({}),
  tagTypes: ["Overview", "Users", "Offers", "redeem", "Receipts", "Faq", "settings", "profile", "notification"],
});
