import { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory classes store for demo
interface Class {
  id: number;
  name: string;  // Changed from title to name to match frontend expectation
  description: string;
  instructor?: string;
  schedule?: string;
  materials?: any[];
}

const classes: Class[] = [
  {
    id: 1,
    name: 'Śravaṇaṃ',
    description: 'Hearing and listening to divine stories, scriptures, and sacred teachings.',
    instructor: 'Guru Maharaj',
    schedule: 'Saturdays 5:00 PM - 6:30 PM'
  },
  {
    id: 2,
    name: 'Kirtanam',
    description: 'Devotional singing and chanting of divine names and glories.',
    instructor: 'Swami Ramanananda',
    schedule: 'Mondays 7:00 PM - 8:30 PM'
  },
  {
    id: 3,
    name: 'Smaranam', 
    description: 'Constant remembrance and contemplation of the divine.',
    instructor: 'Brahmacharini Saraswati',
    schedule: 'Wednesdays 6:00 PM - 7:30 PM'
  },
  {
    id: 4,
    name: 'Pada Sevanam',
    description: 'Humble service at the lotus feet of the Lord.',
    instructor: 'Acharya Vishwanath',
    schedule: 'Fridays 8:00 PM - 9:00 PM'
  },
  {
    id: 5,
    name: 'Archanam',
    description: 'Worship through rituals, ceremonies, and offerings.',
    instructor: 'Pandit Krishna Das',
    schedule: 'Saturdays 6:00 PM - 7:30 PM'
  },
  {
    id: 6,
    name: 'Vandanam',
    description: 'Prayer, prostration, and surrender to the divine will.',
    instructor: 'Mata Devi Priya',
    schedule: 'Sundays 9:00 AM - 10:30 AM'
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const tokenData = JSON.parse(atob(token)); // Base64 decode and parse
    
    // Check if token is expired
    if (Date.now() > tokenData.exp) {
      return res.status(401).json({ error: 'Token expired' });
    }

    if (req.method === 'GET') {
      // Return all classes for now (in real app, filter by user role/permissions)
      return res.status(200).json(classes);
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Classes API Error:', error);
    if (error instanceof SyntaxError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}
