import { VercelRequest, VercelResponse } from '@vercel/node';

// Mock students data (matches admin/students.ts)
const students = [
  {
    id: 2,
    name: 'Demo Student',
    email: 'student@example.com',
    assigned_classes: '', // Empty by default - admin needs to assign classes
    registration_date: '2024-11-10'
  }
];

// Import class data
const allClasses = [
  {
    id: 1,
    name: 'Śravaṇaṃ',
    description: 'Sacred listening and hearing about the divine',
    materials: {
      lyrics: `Śravaṇaṃ - The Path of Sacred Listening

"śravaṇaṃ kīrtanaṃ viṣṇoḥ smaraṇaṃ pāda-sevanam
arcanaṃ vandanaṃ dāsyaṃ sakhyam ātma-nivedanam"

Sacred listening (śravaṇaṃ) is the foundational practice of devotional life...`,
      audio_url: '/audio/sravanam.mp3'
    }
  },
  {
    id: 2,
    name: 'Kirtanam',
    description: 'Devotional singing and chanting',
    materials: {
      lyrics: `Kirtanam - The Path of Sacred Sound

"Hare Krishna Hare Krishna Krishna Krishna Hare Hare
Hare Rama Hare Rama Rama Rama Hare Hare"

Through sacred sound (kīrtana), we purify consciousness...`,
      audio_url: '/audio/kirtanam.mp3'
    }
  },
  {
    id: 3,
    name: 'Smaranam',
    description: 'Remembrance and contemplation',
    materials: {
      lyrics: `Smaranam - The Path of Divine Remembrance

"smartavyaḥ satataṃ viṣṇur vismartavyo na jātucit
sarve vidhi-niṣedhāḥ syur etayor eva kiṅkarāḥ"

Constant remembrance (smaraṇa) of the Supreme...`,
      audio_url: '/audio/smaranam.mp3'
    }
  },
  {
    id: 4,
    name: 'Pada Sevanam',
    description: 'Service to the lotus feet',
    materials: {
      lyrics: `Pada Sevanam - The Path of Divine Service

"pāda-sevanam" refers to serving the lotus feet of the Lord...

Through humble service, we develop genuine humility...`,
      audio_url: '/audio/pada-sevanam.mp3'
    }
  },
  {
    id: 5,
    name: 'Archanam',
    description: 'Ritualistic worship and offerings',
    materials: {
      lyrics: `Archanam - The Path of Sacred Worship

"arcanaṃ" involves ritualistic worship with offerings...

Through sacred worship, we honor the divine presence...`,
      audio_url: '/audio/archanam.mp3'
    }
  },
  {
    id: 6,
    name: 'Vandanam',
    description: 'Prostrations and prayers',
    materials: {
      lyrics: `Vandanam - The Path of Humble Surrender

"vandanaṃ" means offering respectful prostrations...

Through surrender and prayer, we humble the ego...`,
      audio_url: '/audio/vandanam.mp3'
    }
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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
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

    // If user is admin, return all classes
    if (tokenData.role === 'admin') {
      return res.status(200).json(allClasses);
    }

    // For students, return only assigned classes
    const userId = tokenData.userId;
    const student = students.find(s => s.id === userId);
    
    if (!student || !student.assigned_classes) {
      return res.status(200).json([]);
    }

    // Parse assigned class names from comma-separated string
    const assignedClassNames = student.assigned_classes.split(',').map(name => name.trim()).filter(name => name);
    
    // If no assignments, return empty array
    if (assignedClassNames.length === 0) {
      return res.status(200).json([]);
    }

    // Filter classes based on assignments
    const assignedClasses = allClasses.filter(cls => 
      assignedClassNames.includes(cls.name)
    );

    return res.status(200).json(assignedClasses);

  } catch (error) {
    console.error('User classes API Error:', error);
    if (error instanceof SyntaxError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}
