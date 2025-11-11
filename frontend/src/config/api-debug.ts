// Quick test script to debug API URL detection
const getApiBaseUrl = () => {
  // Use environment variable if available (Vite way)
  const envApiUrl = import.meta.env.VITE_API_BASE_URL;
  if (envApiUrl) {
    console.log('Using env variable:', envApiUrl);
    return envApiUrl;
  }
  
  // Detect environment at runtime
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    console.log('Debug - hostname:', hostname);
    console.log('Debug - port:', port);
    console.log('Debug - full URL:', window.location.href);
    
    // Check if we're on Vercel production - use relative /api paths
    if (hostname.includes('vercel.app') || hostname.includes('.vercel.app')) {
      console.log('Detected Vercel environment');
      return '/api';
    }
    
    // Check if we're on any production domain (not localhost)
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      console.log('Detected production environment (not localhost)');
      return '/api';
    }
    
    // Check if we're on localhost and can detect built version
    if (hostname === 'localhost' && port !== '5173' && port !== '5174') {
      console.log('Detected localhost built version');
      return '/api'; // Built version served locally
    }
    
    console.log('Detected localhost development');
  }
  
  // Default to local backend for development
  console.log('Using default localhost backend');
  return 'http://localhost:3001/api';
};

console.log('API Base URL:', getApiBaseUrl());

export default getApiBaseUrl;
