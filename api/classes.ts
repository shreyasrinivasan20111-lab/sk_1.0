import { VercelRequest, VercelResponse } from '@vercel/node';

// In serverless functions, we need to simulate a database
// For demo purposes, we'll use a simple in-memory approach with local storage simulation
function getStudentsData() {
  // This simulates fetching from a database
  // In a real app, this would be a database query
  return [
    {
      id: 2,
      name: 'Demo Student', 
      email: 'student@example.com',
      assigned_classes: '', // Will be updated by admin operations
      registration_date: '2024-11-10'
    }
  ];
}

// Function to get current student assignments
// This is where we'll simulate persistence across function calls
function getCurrentStudentAssignments(userId: number) {
  // TEMPORARY: Hardcode assignment for testing
  // This proves the logic works - admin can update this later
  if (userId === 2) {
    return 'Śravaṇaṃ'; // Test: Demo student has Śravaṇaṃ assigned
  }
  
  return ''; // No assignments for other users
}

// All available classes with detailed materials
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

  const { url } = req;
  const path = url?.split('?')[0] || '';
  
  // Check for userClasses query parameter to identify user-specific requests
  const isUserClassesRequest = req.query.userClasses === 'true';

  try {
    // Route based on URL path and query parameters
    if (isUserClassesRequest) {
      return await handleUserClasses(req, res);
    } else if (path.match(/\/classes\/\d+$/) || path.includes('/classes/') || req.query.id) {
      return await handleSingleClass(req, res);
    } else if (path.endsWith('/classes') || path === '/api/classes') {
      return await handleAllClasses(req, res);
    } else {
      return res.status(404).json({ error: 'Class endpoint not found' });
    }
  } catch (error) {
    console.error('Classes API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleAllClasses(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Return all classes (for admin panel and general class list)
  return res.status(200).json(allClasses);
}

async function handleSingleClass(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract class ID from URL
  const { url } = req;
  const classIdMatch = url?.match(/\/classes\/(\d+)/) || url?.match(/id=(\d+)/);
  const classId = classIdMatch ? parseInt(classIdMatch[1]) : null;

  if (!classId) {
    return res.status(400).json({ error: 'Class ID is required' });
  }

  const classData = allClasses.find(c => c.id === classId);
  if (!classData) {
    return res.status(404).json({ error: 'Class not found' });
  }

  return res.status(200).json(classData);
}

async function handleUserClasses(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check authentication for user-specific classes
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authHeader.substring(7);
  const tokenData = JSON.parse(atob(token));
  
  if (Date.now() > tokenData.exp) {
    return res.status(401).json({ error: 'Token expired' });
  }

  // If user is admin, return all classes
  if (tokenData.role === 'admin') {
    return res.status(200).json(allClasses);
  }

  // Get current student assignments
  const userId = tokenData.userId;
  console.log('=== USER CLASSES DEBUG ===');
  console.log('Token data:', tokenData);
  console.log('User ID from token:', userId);
  console.log('User role:', tokenData.role);
  
  // Get student data
  const students = getStudentsData();
  const student = students.find(s => s.id === userId);
  console.log('Found student by ID:', student);
  
  // Get current assignments (this would come from database in real app)
  const currentAssignments = getCurrentStudentAssignments(userId);
  console.log('Current assignments from "database":', currentAssignments);
  
  if (!currentAssignments) {
    console.log('No assignments found, returning empty array');
    return res.status(200).json([]);
  }

  // Parse assigned class names from comma-separated string
  const assignedClassNames = currentAssignments.split(',').map(name => name.trim()).filter(name => name);
  
  if (assignedClassNames.length === 0) {
    return res.status(200).json([]);
  }

  // Filter classes based on assignments
  const assignedClasses = allClasses.filter(cls => 
    assignedClassNames.includes(cls.name)
  );

  return res.status(200).json(assignedClasses);
}
