import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/init';
import { authenticateToken } from './auth';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow text files, audio files, and documents
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/mp4',
      'video/mp4',
      'video/webm'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  }
});

// Middleware to check admin role
const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Upload material (lyrics or recordings)
router.post('/material', authenticateToken, requireAdmin, upload.single('file'), (req: any, res) => {
  const { classId, title, type, content } = req.body;
  const uploadedBy = req.user.userId;

  if (!classId || !title || !type) {
    return res.status(400).json({ error: 'Class ID, title, and type are required' });
  }

  if (!['lyrics', 'recording'].includes(type)) {
    return res.status(400).json({ error: 'Type must be either "lyrics" or "recording"' });
  }

  let filePath: string | null = null;
  let materialContent = content || '';

  // If file was uploaded, use file path
  if (req.file) {
    filePath = `/uploads/${req.file.filename}`;
  }

  // For lyrics without file upload, content should be provided
  if (type === 'lyrics' && !req.file && !content) {
    return res.status(400).json({ error: 'Lyrics content or file is required' });
  }

  db.run(
    'INSERT INTO materials (class_id, title, type, file_path, content, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)',
    [classId, title, type, filePath, materialContent, uploadedBy],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to save material' });
      }

      res.json({
        message: 'Material uploaded successfully',
        materialId: this.lastID,
        filePath: filePath
      });
    }
  );
});

// Delete material
router.delete('/material/:id', authenticateToken, requireAdmin, (req, res) => {
  const materialId = req.params.id;

  db.run(
    'DELETE FROM materials WHERE id = ?',
    [materialId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete material' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Material not found' });
      }

      res.json({ message: 'Material deleted successfully' });
    }
  );
});

// Get all materials for admin
router.get('/materials', authenticateToken, requireAdmin, (req, res) => {
  db.all(`
    SELECT m.*, c.name as class_name, u.name as uploaded_by_name
    FROM materials m
    LEFT JOIN classes c ON m.class_id = c.id
    LEFT JOIN users u ON m.uploaded_by = u.id
    ORDER BY m.created_at DESC
  `, (err, materials) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(materials);
  });
});

// Error handling middleware for multer
router.use((error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  
  if (error.message === 'File type not allowed') {
    return res.status(400).json({ error: 'File type not allowed' });
  }

  next(error);
});

export default router;
