import { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory users store for demo (matches login.ts)
const users = [
  {
    id: 1,
    email: 'admin@saikalpataruvidyalaya.com',
    name: 'Admin User',
    role: 'admin' as const
  },
  {
    id: 2,
    email: 'student@example.com',
    name: 'Student User',
    role: 'student' as const
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  try {
    // Extract and decode token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const tokenData = JSON.parse(atob(token)); // Base64 decode and parse

    // Check if token is expired
    if (Date.now() > tokenData.exp) {
      return res.status(401).json({ error: 'Token expired' });
    }

    // Find user by ID from token
    const user = users.find(u => u.id === tokenData.userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    // Return user data (without password)
    return res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

  } catch (error) {
    console.error('Auth verification error:', error);
    if (error instanceof SyntaxError) {
      return res.status(401).json({ error: 'Invalid token format' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}
