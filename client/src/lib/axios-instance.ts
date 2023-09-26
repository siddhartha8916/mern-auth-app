import apiPaths from "@/config/api-paths";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: apiPaths.API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 1000 * 60 * 2,
});

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const user = localStorage.getItem("user");

//     if (typeof user === "string") {
//       const userData = JSON.parse(user);
//       const token = userData?.state?.user?.token;

//       // Get the token from your useAuth hook
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.response.use(
//   function (res) {
//     return res;
//   },
//   (err) => {
//     err.message =
//       err?.response?.data?.error ||
//       err?.response?.data?.message ||
//       err?.message ||
//       "Something went wrong";
//     return Promise.reject(err);
//   }
// );

export default axiosInstance;
