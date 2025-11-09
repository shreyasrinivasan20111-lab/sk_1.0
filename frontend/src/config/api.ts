// API configuration for different environments
const getApiBaseUrl = () => {
  // Use environment variable if available
  const envApiUrl = import.meta.env.VITE_API_BASE_URL;
  if (envApiUrl) {
    return envApiUrl;
  }
  
  // Detect environment
  if (typeof window !== 'undefined') {
    // Check if we're on Vercel production
    if (window.location.hostname.includes('vercel.app')) {
      // For production, we need a deployed backend
      // Since we don't have a backend deployed yet, show a helpful message
      console.error('Production backend not configured. Please deploy backend and set VITE_API_BASE_URL environment variable in Vercel.');
      return '/api'; // This will fail but provides context
    }
  }
  
  // Default to localhost for development
  return 'http://localhost:3001/api';
};

export default getApiBaseUrl();
