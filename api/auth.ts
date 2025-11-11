import { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory user store for demo
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req;
  const path = url?.split('?')[0] || '';

  try {
    // Route based on URL path
    if (path.endsWith('/auth/login')) {
      return await handleLogin(req, res);
    } else if (path.endsWith('/auth/register')) {
      return await handleRegister(req, res);
    } else if (path.endsWith('/auth/me')) {
      return await handleMe(req, res);
    } else {
      return res.status(404).json({ error: 'Auth endpoint not found' });
    }
  } catch (error) {
    console.error('Auth API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleLogin(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const tokenData = {
    userId: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + (24 * 60 * 60 * 1000)
  };
  
  const token = JSON.stringify(tokenData);
  const encodedToken = btoa(token);

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
}

async function handleRegister(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser: User = {
    id: userIdCounter++,
    name,
    email,
    password,
    role: 'student'
  };

  users.push(newUser);

  const tokenData = {
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
    exp: Date.now() + (24 * 60 * 60 * 1000)
  };
  
  const token = JSON.stringify(tokenData);
  const encodedToken = btoa(token);

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
}

async function handleMe(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authHeader.substring(7);
  const tokenData = JSON.parse(atob(token));
  
  if (Date.now() > tokenData.exp) {
    return res.status(401).json({ error: 'Token expired' });
  }

  const user = users.find(u => u.id === tokenData.userId);
  if (!user) {
    return res.status(401).json({ error: 'Invalid user' });
  }

  return res.status(200).json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  });
}
