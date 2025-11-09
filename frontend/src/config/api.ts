// API configuration for different environments
const getApiBaseUrl = () => {
  // Use environment variable if available
  const envApiUrl = import.meta.env.VITE_API_BASE_URL;
  if (envApiUrl) {
    console.log('🔧 API: Using env variable:', envApiUrl);
    return envApiUrl;
  }
  
  // Detect environment at runtime
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const port = window.location.port;
    const href = window.location.href;
    
    console.log('🔧 API Debug - hostname:', hostname);
    console.log('🔧 API Debug - port:', port);
    console.log('🔧 API Debug - full URL:', href);
    
    // Check if we're on Vercel production - use relative /api paths
    if (hostname.includes('vercel.app') || hostname.includes('.vercel.app')) {
      console.log('🔧 API: Detected Vercel environment -> /api');
      return '/api';
    }
    
    // Check if we're on any production domain (not localhost)
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      console.log('🔧 API: Detected production environment -> /api');
      return '/api';
    }
    
    // Check if we're on localhost and can detect built version
    if (hostname === 'localhost' && port !== '5173' && port !== '5174') {
      console.log('🔧 API: Detected localhost built version -> /api');
      return '/api'; // Built version served locally
    }
    
    console.log('🔧 API: Detected localhost development -> localhost:3001');
  }
  
  // Default to local backend for development
  const result = 'http://localhost:3001/api';
  console.log('🔧 API: Using default localhost backend:', result);
  return result;
};

// Export the function, not the result, so it's evaluated at runtime
export default getApiBaseUrl;
