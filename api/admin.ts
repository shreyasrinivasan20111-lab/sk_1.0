import { VercelRequest, VercelResponse } from '@vercel/node';

// Mock students data
const students = [
  {
    id: 2,
    name: 'Demo Student',
    email: 'student@example.com',
    assigned_classes: '',
    registration_date: '2024-11-10'
  }
];

// Set global reference for cross-function access
if (typeof global !== 'undefined') {
  global.students = students;
}

// Mock practice sessions data
const practiceSessions: any[] = [];

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check authentication first
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  try {
    const token = authHeader.substring(7);
    const tokenData = JSON.parse(atob(token));
    
    if (Date.now() > tokenData.exp) {
      return res.status(401).json({ error: 'Token expired' });
    }

    if (tokenData.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { url } = req;
    const path = url?.split('?')[0] || '';

    // Route based on URL path
    if (path.endsWith('/admin/students')) {
      return await handleStudents(req, res);
    } else if (path.endsWith('/admin/practice-sessions')) {
      return await handlePracticeSessions(req, res);
    } else if (path.endsWith('/admin/stats')) {
      return await handleStats(req, res);
    } else if (path.endsWith('/admin/assign-class')) {
      return await handleAssignClass(req, res);
    } else if (path.endsWith('/admin/remove-class')) {
      return await handleRemoveClass(req, res);
    } else {
      return res.status(404).json({ error: 'Admin endpoint not found' });
    }
  } catch (error) {
    console.error('Admin API Error:', error);
    if (error instanceof SyntaxError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleStudents(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  return res.status(200).json(students);
}

async function handlePracticeSessions(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  return res.status(200).json(practiceSessions);
}

async function handleStats(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stats = {
    totalStudents: students.length,
    totalSessions: practiceSessions.length,
    totalDuration: practiceSessions.reduce((sum, session) => sum + (session.duration || 0), 0),
    studentsByClass: allClasses.map(cls => ({
      class_name: cls.name,
      student_count: students.filter(student => 
        student.assigned_classes && student.assigned_classes.includes(cls.name)
      ).length
    }))
  };

  return res.status(200).json(stats);
}

async function handleAssignClass(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { studentId, classId } = req.body;

  if (!studentId || !classId) {
    return res.status(400).json({ error: 'Student ID and Class ID are required' });
  }

  const student = students.find(s => s.id === parseInt(studentId));
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const classToAssign = allClasses.find(c => c.id === parseInt(classId));
  if (!classToAssign) {
    return res.status(404).json({ error: 'Class not found' });
  }

  let currentClasses = student.assigned_classes ? 
    student.assigned_classes.split(',').map(name => name.trim()).filter(name => name) : [];

  if (currentClasses.includes(classToAssign.name)) {
    return res.status(400).json({ error: 'Class already assigned to this student' });
  }

  currentClasses.push(classToAssign.name);
  student.assigned_classes = currentClasses.join(',');

  // Update global reference
  if (typeof global !== 'undefined') {
    global.students = students;
  }

  console.log('Class assigned. Student now has:', student.assigned_classes);

  return res.status(200).json({
    message: 'Class assigned successfully',
    student: student
  });
}

async function handleRemoveClass(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { studentId, classId } = req.body;

  if (!studentId || !classId) {
    return res.status(400).json({ error: 'Student ID and Class ID are required' });
  }

  const student = students.find(s => s.id === parseInt(studentId));
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const classToRemove = allClasses.find(c => c.id === parseInt(classId));
  if (!classToRemove) {
    return res.status(404).json({ error: 'Class not found' });
  }

  let currentClasses = student.assigned_classes ? 
    student.assigned_classes.split(',').map(name => name.trim()).filter(name => name) : [];

  if (!currentClasses.includes(classToRemove.name)) {
    return res.status(400).json({ error: 'Class is not assigned to this student' });
  }

  currentClasses = currentClasses.filter(name => name !== classToRemove.name);
  student.assigned_classes = currentClasses.join(',');

  // Update global reference
  if (typeof global !== 'undefined') {
    global.students = students;
  }

  console.log('Class removed. Student now has:', student.assigned_classes);

  return res.status(200).json({
    message: 'Class assignment removed successfully',
    student: student
  });
}
