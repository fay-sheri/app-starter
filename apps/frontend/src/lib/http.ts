import axios from "axios";
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
}, (error) => {
  if (error.response) {
    console.error('API Error:', error.response.data);
    if (error.response?.status === 401) {
      console.log('Unauthorized access - redirecting to login.');
    }
  } else if (error.request) {
    console.error('No response received:', error.request);
  }
  return Promise.reject(error);
});
