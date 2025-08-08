import Cookies from 'js-cookie';
import axios from 'axios';
const api = axios.create({
    baseURL: 'https://my-backend-gules.vercel.app',
});


api.interceptors.request.use(
    (config) => {
      const token = Cookies.get('token');
      if(token){
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

export default api;
