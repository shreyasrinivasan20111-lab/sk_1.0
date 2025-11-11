import { VercelRequest, VercelResponse } from '@vercel/node';

// Note: In serverless functions, each invocation is independent
// For demo purposes, we'll use a simple approach with predefined users
// In production, this would use a proper database

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'student';
}

// Static users for demo - in production this would be a database
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

let userIdCounter = 3;

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
      password, // In production, hash this password
      role: 'student'
    };

    users.push(newUser);
    
    // Note: In a real app, this would be persisted to a database
    // For this demo, the user will only exist for this session
    
    // Create simple token
    const tokenData = {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    
    const token = JSON.stringify(tokenData);
    const encodedToken = btoa(token); // Base64 encode

    return res.status(201).json({
      message: 'User created successfully',
      token: encodedToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Register API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
