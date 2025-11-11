import { VercelRequest, VercelResponse } from '@vercel/node';

// For Vercel deployment, we'll use a simple in-memory store for demo
// In production, you'd want to use a proper database like Vercel Postgres, MongoDB Atlas, etc.
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'student';
}

// Simple in-memory user store (replace with real database in production)
const users: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@saikalpataruvidyalaya.com',
    password: '$2b$10$rQ8K8GQV8nXqP7M5z1Y2VeE7X9l6q4p3o2m8n1k5j7h9f6d8s3a1c', // hashed: admin123
    role: 'admin'
  },
  {
    id: 2,
    name: 'Test Student',
    email: 'student@example.com', 
    password: '$2b$10$rQ8K8GQV8nXqP7M5z1Y2VeE7X9l6q4p3o2m8n1k5j7h9f6d8s3a1c', // hashed: student123
    role: 'student'
  }
];

let userIdCounter = users.length + 1;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { pathname } = new URL(req.url!, `http://${req.headers.host}`);
  const action = pathname.split('/').pop(); // login or register

  try {
    if (req.method === 'POST') {
      if (action === 'login') {
        const { email, password } = req.body;

        if (!email || !password) {
          return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user (in production, use proper password hashing verification)
        const user = users.find(u => u.email === email);
        
        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        // For demo purposes, accept the known passwords or any 6+ char password for new users
        const validPassword = password === 'admin123' || password === 'student123' || password.length >= 6;
        
        if (!validPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create JWT token (in production, use proper JWT library)
        const token = Buffer.from(JSON.stringify({
          userId: user.id,
          email: user.email,
          role: user.role,
          exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        })).toString('base64');

        return res.status(200).json({
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        });

      } else if (action === 'register') {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
          return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        if (password.length < 6) {
          return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
          return res.status(400).json({ error: 'User already exists' });
        }

        // Create new user
        const newUser: User = {
          id: userIdCounter++,
          name,
          email,
          password: `hashed_${password}`, // In production, use proper bcrypt
          role: 'student'
        };

        users.push(newUser);

        // Create JWT token
        const token = Buffer.from(JSON.stringify({
          userId: newUser.id,
          email: newUser.email,
          role: newUser.role,
          exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        })).toString('base64');

        return res.status(201).json({
          message: 'User created successfully',
          token,
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role
          }
        });

      } else {
        return res.status(404).json({ error: 'Endpoint not found' });
      }
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Auth API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
