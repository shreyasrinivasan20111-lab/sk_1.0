import { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory user store for demo (replace with real database in production)
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'student';
}

const users: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@saikalpataru.com',
    password: 'admin@sai123',
    role: 'admin'
  },
  // Demo students for testing
  {
    id: 2,
    name: 'Demo Student',
    email: 'student@example.com',
    password: 'student123',
    role: 'student'
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create simple token (in production, use proper JWT)
    const tokenData = {
      userId: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    
    const token = JSON.stringify(tokenData);
    const encodedToken = btoa(token); // Base64 encode

    return res.status(200).json({
      message: 'Login successful',
      token: encodedToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
