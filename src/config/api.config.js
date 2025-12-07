const getApiUrl = () => {
  return 'http://192.168.234.1:3000/api';
};

export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  TIMEOUT: 10000,
};

export default API_CONFIG;




