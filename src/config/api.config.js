const getApiUrl = () => {
  return 'http://192.168.11.190:3000/api';
};

export const API_URL = getApiUrl();

export const API_CONFIG = {
  BASE_URL: API_URL,
  TIMEOUT: 10000,
};

export default API_CONFIG;






