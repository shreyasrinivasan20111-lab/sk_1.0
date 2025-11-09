// API configuration for different environments
const getApiBaseUrl = () => {
  // Use environment variable if available
  const envApiUrl = import.meta.env.VITE_API_BASE_URL;
  if (envApiUrl) {
    return envApiUrl;
  }
  
  // Detect environment
  if (typeof window !== 'undefined') {
    // Check if we're on Vercel production - use relative /api paths
    if (window.location.hostname.includes('vercel.app')) {
      return '/api'; // Vercel serverless functions
    }
    
    // Check if we're on localhost and can detect built version
    if (window.location.hostname === 'localhost' && window.location.port !== '5174') {
      return '/api'; // Built version served locally
    }
  }
  
  // Default to local backend for development
  return 'http://localhost:3001/api';
};

export default getApiBaseUrl();
