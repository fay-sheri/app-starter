// 双token测试http
import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { TokenExpiredError } from '../Error/auth/AuthError'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use((response) => {
  // return response.data; //一定要注意拦截器解包导致ts类型不能正确推断，ts还认为是参数response的类型
  return response;  //不解包了
}, (error: AxiosError) => {
  const config = error.config as InternalAxiosRequestConfig | undefined;
    // 刷新接口自己 / 已重试过 / 非 401 
    if (
      !config ||
      config.url?.includes("/auth/refresh") ||
      config.skipAuthRefresh ||
      config.__retried ||
      error.response?.status !== 401
    ) {
      return Promise.reject(error);
    }
    // 抛特定错误，把原 config 带出去，通过判断错误判断是否要刷新
    return Promise.reject(new TokenExpiredError(config));
  }
);
