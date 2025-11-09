import { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory classes store for demo
interface Class {
  id: number;
  title: string;
  description: string;
  instructor: string;
  schedule: string;
  materials: any[];
}

const classes: Class[] = [
  {
    id: 1,
    title: 'Introduction to Vedic Philosophy',
    description: 'Explore the fundamental principles of Vedic wisdom and philosophy.',
    instructor: 'Swami Ramanananda',
    schedule: 'Mondays 7:00 PM - 8:30 PM',
    materials: []
  },
  {
    id: 2,
    title: 'Bhagavad Gita Study',
    description: 'Deep dive into the teachings of the Bhagavad Gita.',
    instructor: 'Brahmacharini Saraswati',
    schedule: 'Wednesdays 6:00 PM - 7:30 PM',
    materials: []
  },
  {
    id: 3,
    title: 'Meditation and Mindfulness',
    description: 'Learn practical techniques for meditation and mindful living.',
    instructor: 'Acharya Vishwanath',
    schedule: 'Fridays 8:00 PM - 9:00 PM',
    materials: []
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

  try {
    if (req.method === 'GET') {
      // Return all classes
      return res.status(200).json({
        success: true,
        classes: classes
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Classes API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
