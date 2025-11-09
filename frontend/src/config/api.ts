// For Vercel deployment, we might need to use the full URL
const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    // In production, use relative URLs for same domain
    return '/api';
  }
  // In development, use localhost
  return 'http://localhost:3001/api';
};

export default getApiBaseUrl();
