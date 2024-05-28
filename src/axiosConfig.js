import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:7235/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401) {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const refreshUrl = `/Token/refresh?jwtToken=${accessToken}&refreshToken=${refreshToken}`;

        const { data } = await axios.get(refreshUrl);

        if (data.success) {
          localStorage.setItem('accessToken', data.value.accessToken);
          localStorage.setItem('refreshToken', data.value.refreshToken);

          originalRequest.headers['Authorization'] = `Bearer ${data.value.accessToken}`;

          return axiosInstance(originalRequest);
        } else {
          window.location.href = '/sign-in';
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error('Ошибка при обновлении токена:', refreshError);
        window.location.href = '/sign-in';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
