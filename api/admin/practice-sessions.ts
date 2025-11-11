import { VercelRequest, VercelResponse } from '@vercel/node';

// Mock practice sessions data for demo
const practiceSessions = [
  {
    id: 1,
    student_name: 'John Doe',
    class_name: 'Śravaṇaṃ', 
    duration: 40,
    date: '2024-11-09',
    notes: 'Deep listening to Bhāgavatam recitation'
  },
  {
    id: 2,
    student_name: 'John Doe',
    class_name: 'Kirtanam', 
    duration: 45,
    date: '2024-11-08',
    notes: 'Focused on devotional melodies'
  },
  {
    id: 2,
    student_name: 'Jane Smith',
    class_name: 'Pada Sevanam',
    duration: 60,
    date: '2024-11-07', 
    notes: 'Service meditation practice'
  },
  {
    id: 3,
    student_name: 'Jane Smith',
    class_name: 'Pada Sevanam',
    duration: 60,
    date: '2024-11-07', 
    notes: 'Service meditation practice'
  },
  {
    id: 4,
    student_name: 'Mike Johnson',
    class_name: 'Vandanam',
    duration: 30,
    date: '2024-11-06',
    notes: 'Prayer and prostration practice'
  },
  {
    id: 5,
    student_name: 'John Doe', 
    class_name: 'Smaranam',
    duration: 35,
    date: '2024-11-05',
    notes: 'Remembrance and contemplation'
  },
  {
    id: 6,
    student_name: 'Jane Smith',
    class_name: 'Archanam',
    duration: 50,
    date: '2024-11-04',
    notes: 'Ritual worship practice'
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
      return res.status(200).json(practiceSessions);
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Admin practice sessions API Error:', error);
    if (error instanceof SyntaxError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}
