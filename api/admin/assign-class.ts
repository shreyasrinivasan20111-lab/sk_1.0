import { VercelRequest, VercelResponse } from '@vercel/node';

// Mock students data (should match admin/students.ts)
const students = [
  {
    id: 2,
    name: 'Demo Student',
    email: 'student@example.com',
    assigned_classes: '', // Empty by default - admin needs to assign classes
    registration_date: '2024-11-10'
  }
];

// All available classes
const allClasses = [
  { id: 1, name: 'Śravaṇaṃ' },
  { id: 2, name: 'Kirtanam' },
  { id: 3, name: 'Smaranam' },
  { id: 4, name: 'Pada Sevanam' },
  { id: 5, name: 'Archanam' },
  { id: 6, name: 'Vandanam' }
];

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

    const { studentId, classId } = req.body;

    if (!studentId || !classId) {
      return res.status(400).json({ error: 'Student ID and Class ID are required' });
    }

    // Find the student
    const student = students.find(s => s.id === parseInt(studentId));
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Find the class
    const classToAssign = allClasses.find(c => c.id === parseInt(classId));
    if (!classToAssign) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Parse current assignments
    let currentClasses = student.assigned_classes ? 
      student.assigned_classes.split(',').map(name => name.trim()).filter(name => name) : [];

    // Check if class is already assigned
    if (currentClasses.includes(classToAssign.name)) {
      return res.status(400).json({ error: 'Class already assigned to this student' });
    }

    // Add new class
    currentClasses.push(classToAssign.name);
    student.assigned_classes = currentClasses.join(',');

    return res.status(200).json({
      message: 'Class assigned successfully',
      student: student
    });

  } catch (error) {
    console.error('Admin assign class API Error:', error);
    if (error instanceof SyntaxError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}
