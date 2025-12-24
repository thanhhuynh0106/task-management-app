const getApiUrl = () => {
  return "http://192.168.80.1:3000/api";
};

export const API_URL = getApiUrl();

export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  TIMEOUT: 30000,
};

export default API_CONFIG;
