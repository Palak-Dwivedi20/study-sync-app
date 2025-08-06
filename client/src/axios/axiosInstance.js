import axios from "axios";
import store from "../store/store";
import { fetchCurrentUser, logoutUser } from "../features/authSlice";

// Create axios instance
const axiosInstance = axios.create({
    baseURL: "/api/v1",
    withCredentials: true, // so accessToken cookie is sent
});

// -------------------------------------
// ✅ 1. Request Interceptor: Attach Token in Headers (optional fallback)
// -------------------------------------
axiosInstance.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const accessToken = state.auth?.accessToken;

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// -------------------------------------
// ✅ 2. Response Interceptor: Auto-refresh Access Token
// -------------------------------------
// axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         if (
//             error.response?.status === 401 &&
//             !originalRequest._retry &&
//             !originalRequest.url.includes("/refresh-token")
//         ) {
//             originalRequest._retry = true;
//             try {
//                 // Get new access token using refresh token (sent via HTTP-only cookie)
//                 await axiosInstance.post("/refresh-token");

//                 // Update Redux user state
//                 await store.dispatch(fetchCurrentUser());

//                 // Retry the original request
//                 return axiosInstance(originalRequest);
//             } catch (refreshError) {
//                 await store.dispatch(logoutUser());
//                 return Promise.reject(refreshError);
//             }
//         }

//         return Promise.reject(error);
//     }
// );

export default axiosInstance;
