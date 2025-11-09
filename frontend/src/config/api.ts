// API configuration for different environments
const getApiBaseUrl = () => {
  // Use environment variable if available
  const envApiUrl = import.meta.env.VITE_API_BASE_URL;
  if (envApiUrl) {
    return envApiUrl;
  }
  
  // Fallback logic for different environments
  if (typeof window !== 'undefined') {
    // Check if we're on Vercel
    if (window.location.hostname.includes('vercel.app')) {
      // For Vercel deployment, you'll need to deploy backend separately
      console.warn('Backend URL not configured for production. Please set VITE_API_BASE_URL environment variable.');
      return '/api'; // This will fail until backend is deployed
    }
  }
  
  // Default to localhost for development
  return 'http://localhost:3001/api';
};

export default getApiBaseUrl();
