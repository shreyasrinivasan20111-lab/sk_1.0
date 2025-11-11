import { VercelRequest, VercelResponse } from '@vercel/node';

// Mock class data with materials for demo
const classesWithMaterials: { [key: string]: any } = {
  '1': {
    id: 1,
    name: 'Kirtanam',
    description: 'Devotional singing and chanting of divine names and glories.',
    instructor: 'Swami Ramanananda',
    schedule: 'Mondays 7:00 PM - 8:30 PM',
    materials: {
      lyrics: [
        {
          id: 1,
          title: 'Bhaja Govindam',
          type: 'lyrics',
          content: 'Bhaja govindam bhaja govindam\nGovindam bhaja moodha mate\nSamprapte sannihite kale\nNahi nahi rakshati dukrn karane',
          uploaded_by_name: 'Admin',
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          title: 'Hare Krishna Mahamantra',
          type: 'lyrics',
          content: 'Hare Krishna Hare Krishna\nKrishna Krishna Hare Hare\nHare Rama Hare Rama\nRama Rama Hare Hare',
          uploaded_by_name: 'Admin',
          created_at: '2024-01-20T11:00:00Z'
        }
      ],
      recordings: [
        {
          id: 3,
          title: 'Bhaja Govindam - Audio Guide',
          type: 'recording',
          file_path: '/uploads/bhaja-govindam.mp3',
          uploaded_by_name: 'Swami Ramanananda',
          created_at: '2024-01-25T09:00:00Z'
        }
      ]
    }
  },
  '2': {
    id: 2,
    name: 'Smaranam',
    description: 'Constant remembrance and contemplation of the divine.',
    instructor: 'Brahmacharini Saraswati',
    schedule: 'Wednesdays 6:00 PM - 7:30 PM',
    materials: {
      lyrics: [
        {
          id: 4,
          title: 'Names of Krishna',
          type: 'lyrics',
          content: 'Krishna, Govinda, Gopala, Madhava\nKeshava, Madhusudana, Trivikrama\nVamana, Sridhara, Hrishikesha',
          uploaded_by_name: 'Admin',
          created_at: '2024-02-01T10:00:00Z'
        }
      ],
      recordings: []
    }
  },
  '3': {
    id: 3,
    name: 'Pada Sevanam',
    description: 'Humble service at the lotus feet of the Lord.',
    instructor: 'Acharya Vishwanath',
    schedule: 'Fridays 8:00 PM - 9:00 PM',
    materials: {
      lyrics: [
        {
          id: 5,
          title: 'Service Meditation',
          type: 'lyrics',
          content: 'At thy lotus feet, O Lord\nI offer my humble service\nWith devotion pure and true\nMay I serve thee always',
          uploaded_by_name: 'Admin',
          created_at: '2024-02-05T10:00:00Z'
        }
      ],
      recordings: []
    }
  },
  '4': {
    id: 4,
    name: 'Archanam',
    description: 'Worship through rituals, ceremonies, and offerings.',
    instructor: 'Pandit Krishna Das',
    schedule: 'Saturdays 6:00 PM - 7:30 PM',
    materials: {
      lyrics: [
        {
          id: 6,
          title: 'Aarti Songs',
          type: 'lyrics',
          content: 'Om jai jagadish hare\nSwami jai jagadish hare\nBhakt jano ke sankat\nDas jano ke sankat\nKshan me dur kare',
          uploaded_by_name: 'Admin',
          created_at: '2024-02-10T10:00:00Z'
        }
      ],
      recordings: []
    }
  },
  '5': {
    id: 5,
    name: 'Vandanam',
    description: 'Prayer, prostration, and surrender to the divine will.',
    instructor: 'Mata Devi Priya',
    schedule: 'Sundays 9:00 AM - 10:30 AM',
    materials: {
      lyrics: [
        {
          id: 7,
          title: 'Surrender Prayer',
          type: 'lyrics',
          content: 'I surrender all to thee\nMy Lord, my guide, my light\nTake my will, my heart, my soul\nMake me thine completely',
          uploaded_by_name: 'Admin',
          created_at: '2024-02-15T10:00:00Z'
        }
      ],
      recordings: []
    }
  }
};

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

    if (req.method === 'GET') {
      // Extract class ID from the URL path
      const pathParts = req.url?.split('/') || [];
      const classId = pathParts[pathParts.length - 1];
      
      if (!classId) {
        return res.status(400).json({ error: 'Class ID required' });
      }

      const classData = classesWithMaterials[classId];
      if (!classData) {
        return res.status(404).json({ error: 'Class not found' });
      }

      return res.status(200).json(classData);
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Class details API Error:', error);
    if (error instanceof SyntaxError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}
