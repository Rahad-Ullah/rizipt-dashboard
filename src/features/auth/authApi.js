import { baseApi } from "../../utils/apiBaseQuery";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Forgot Password
    forgotEmail: builder.mutation({
      query: (data) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: typeof data === "string" ? { email: data } : data,
      }),
    }),

    // Verify OTP
    forgotEmailOTPCheck: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: {
          email: data.email,
          oneTimeCode: Number(data.oneTimeCode),
        },
      }),
    }),

    // Resend OTP
    resendPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/generate-otp",
        method: "POST",
        body: typeof data === "string" ? { email: data } : data,
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation({
      query: ({ token, newPassword, confirmPassword }) => ({
        url: "/auth/reset-password",
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: {
          newPassword,
          confirmPassword,
        },
      }),
    }),
  }),
});

// Export hooks
export const {
  useLoginMutation,
  useForgotEmailMutation,
  useForgotEmailOTPCheckMutation,
  useResetPasswordMutation,
  useResendPasswordMutation,
} = authApi;

