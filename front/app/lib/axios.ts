import axios from "axios";
import createAuthRefreshInterceptorModule from "axios-auth-refresh";
const createAuthRefreshInterceptor =
  (createAuthRefreshInterceptorModule as any).default ??
  createAuthRefreshInterceptorModule;
import { getAccessToken, getRefreshToken } from "./auth";

export const API_URL =
  typeof window === "undefined"
    ? process.env.VITE_API_URL
    : import.meta.env.VITE_API_URL;

const axiosService = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosService.interceptors.request.use(async (config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosService.interceptors.response.use(
  (res) => Promise.resolve(res),
  (err) => Promise.reject(err),
);

const refreshAuthLogic = async (failedRequest: any) => {
  return axios
    .post("/auth/refresh/", null, {
      baseURL: API_URL,
      headers: {
        Authorization: `Bearer ${getRefreshToken()}`,
      },
    })
    .then((res) => {
      const { access, refresh } = res.data;
      failedRequest.response.config.headers["Authorization"] =
        "Bearer " + access;
      localStorage.setItem("auth", JSON.stringify({ access, refresh }));
    })
    .catch(() => {
      localStorage.removeItem("auth");
    });
};

createAuthRefreshInterceptor(axiosService, refreshAuthLogic);

export async function fetcher(url: string) {
  const res = await axiosService.get(url);
  return res.data;
}

export default axiosService;
