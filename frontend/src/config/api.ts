// API configuration for different environments
const getApiBaseUrl = () => {
  // Use environment variable if available (should be empty now)
  const envApiUrl = import.meta.env.VITE_API_BASE_URL;
  if (envApiUrl) {
    return envApiUrl;
  }
  
  // Detect environment at runtime
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    // Check if we're on Vercel production - use relative /api paths
    if (hostname.includes('vercel.app') || hostname.includes('.vercel.app')) {
      return '/api';
    }
    
    // Check if we're on any production domain (not localhost)
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return '/api';
    }
    
    // Check if we're on localhost and can detect built version
    if (hostname === 'localhost' && port !== '5173' && port !== '5174') {
      return '/api'; // Built version served locally
    }
  }
  
  // Default to local backend for development
  return 'http://localhost:3001/api';
};

// Export the function, not the result, so it's evaluated at runtime
export default getApiBaseUrl;
