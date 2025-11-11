import { VercelRequest, VercelResponse } from '@vercel/node';
import { getAllStudents } from '../shared/data';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check authentication
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  try {
    // Decode and validate token
    const token = authHeader.substring(7);
    const tokenData = JSON.parse(atob(token));
    
    // Check if token is expired
    if (Date.now() > tokenData.exp) {
      return res.status(401).json({ error: 'Token expired' });
    }

    // Check if user is admin
    if (tokenData.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    if (req.method === 'GET') {
      return res.status(200).json(getAllStudents());
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Admin students API Error:', error);
    if (error instanceof SyntaxError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}
