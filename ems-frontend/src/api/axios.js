import axios from "axios";

// Creates a custom Axios instance for API calls, with a defined base URL.
const instance = axios.create({
  baseURL: "http://localhost:8000/api/",
});

instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access");

    // Do NOT attach token for login/register
    // Automatically attaches the JWT access token from localStorage to the Authorization header of the request.
    if (
      accessToken &&
      !config.url.includes("login") &&
      !config.url.includes("register")
    ) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
