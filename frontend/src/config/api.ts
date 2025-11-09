// API configuration for different environments
const getApiBaseUrl = () => {
  // Force localhost for now to debug the issue
  return 'http://localhost:3001/api';
};

export default getApiBaseUrl();
