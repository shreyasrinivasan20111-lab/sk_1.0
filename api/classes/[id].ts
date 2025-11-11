import { VercelRequest, VercelResponse } from '@vercel/node';

// Mock class data with materials for demo
const classesWithMaterials: { [key: string]: any } = {
  '1': {
    id: 1,
    name: 'Śravaṇaṃ',
    description: 'Hearing and listening to divine stories, scriptures, and sacred teachings.',
    instructor: 'Guru Maharaj',
    schedule: 'Saturdays 5:00 PM - 6:30 PM',
    materials: {
      lyrics: [
        {
          id: 1,
          title: 'Śrīmad Bhāgavatam Verses',
          type: 'lyrics',
          content: 'śrīmad-bhāgavataṃ purāṇam amalaṃ\nyad vaiṣṇavānāṃ priyam\nyasmin pāramahaṃsyam ekam amalaṃ\njñānaṃ paraṃ gīyate',
          uploaded_by_name: 'Admin',
          created_at: '2024-01-10T09:00:00Z'
        },
        {
          id: 2,
          title: 'Sacred Listening Practice',
          type: 'lyrics',
          content: 'Listen with devotion pure and true\nTo stories of the Divine blue\nHear the names that purify\nLet sacred sounds your soul sanctify',
          uploaded_by_name: 'Admin',
          created_at: '2024-01-12T10:00:00Z'
        }
      ],
      recordings: [
        {
          id: 3,
          title: 'Bhāgavatam Recitation',
          type: 'recording',
          file_path: '/uploads/bhagavatam-recitation.mp3',
          uploaded_by_name: 'Guru Maharaj',
          created_at: '2024-01-14T08:00:00Z'
        }
      ]
    }
  },
  '2': {
    id: 2,
    name: 'Kirtanam',
    description: 'Devotional singing and chanting of divine names and glories.',
    instructor: 'Swami Ramanananda',
    schedule: 'Mondays 7:00 PM - 8:30 PM',
    materials: {
      lyrics: [
        {
          id: 4,
          title: 'Bhaja Govindam',
          type: 'lyrics',
          content: 'Bhaja govindam bhaja govindam\nGovindam bhaja moodha mate\nSamprapte sannihite kale\nNahi nahi rakshati dukrn karane',
          uploaded_by_name: 'Admin',
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 5,
          title: 'Hare Krishna Mahamantra',
          type: 'lyrics',
          content: 'Hare Krishna Hare Krishna\nKrishna Krishna Hare Hare\nHare Rama Hare Rama\nRama Rama Hare Hare',
          uploaded_by_name: 'Admin',
          created_at: '2024-01-20T11:00:00Z'
        }
      ],
      recordings: [
        {
          id: 6,
          title: 'Bhaja Govindam - Audio Guide',
          type: 'recording',
          file_path: '/uploads/bhaja-govindam.mp3',
          uploaded_by_name: 'Swami Ramanananda',
          created_at: '2024-01-25T09:00:00Z'
        }
      ]
    }
  },
  '3': {
    id: 3,
    name: 'Smaranam',
    description: 'Constant remembrance and contemplation of the divine.',
    instructor: 'Brahmacharini Saraswati',
    schedule: 'Wednesdays 6:00 PM - 7:30 PM',
    materials: {
      lyrics: [
        {
          id: 7,
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
  '4': {
    id: 4,
    name: 'Pada Sevanam',
    description: 'Humble service at the lotus feet of the Lord.',
    instructor: 'Acharya Vishwanath',
    schedule: 'Fridays 8:00 PM - 9:00 PM',
    materials: {
      lyrics: [
        {
          id: 8,
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
  '5': {
    id: 5,
    name: 'Archanam',
    description: 'Worship through rituals, ceremonies, and offerings.',
    instructor: 'Pandit Krishna Das',
    schedule: 'Saturdays 6:00 PM - 7:30 PM',
    materials: {
      lyrics: [
        {
          id: 9,
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
  '6': {
    id: 6,
    name: 'Vandanam',
    description: 'Prayer, prostration, and surrender to the divine will.',
    instructor: 'Mata Devi Priya',
    schedule: 'Sundays 9:00 AM - 10:30 AM',
    materials: {
      lyrics: [
        {
          id: 10,
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
      // Extract class ID from the URL path - multiple methods for Vercel compatibility
      let classId: string | undefined;
      
      // Method 1: Try to get from query parameters (Vercel's preferred way)
      if (req.query && typeof req.query.id === 'string') {
        classId = req.query.id;
      } else {
        // Method 2: Parse from URL path as fallback
        const pathParts = req.url?.split('/') || [];
        classId = pathParts[pathParts.length - 1];
      }
      
      console.log('Extracting class ID:', { url: req.url, query: req.query, classId });
      
      if (!classId) {
        return res.status(400).json({ error: 'Class ID required' });
      }

      const classData = classesWithMaterials[classId];
      console.log('Looking up class data:', { classId, found: !!classData, availableIds: Object.keys(classesWithMaterials) });
      
      if (!classData) {
        return res.status(404).json({ error: `Class not found for ID: ${classId}` });
      }

      console.log('Returning class data:', { id: classData.id, name: classData.name });
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
