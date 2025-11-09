"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const init_1 = require("../database/init");
const auth_1 = require("./auth");
const router = express_1.default.Router();
// Get all classes available to the user
router.get('/', auth_1.authenticateToken, (req, res) => {
    const userId = req.user.userId;
    const userRole = req.user.role;
    if (userRole === 'admin') {
        // Admins can see all classes
        init_1.db.all('SELECT * FROM classes ORDER BY name', (err, classes) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(classes);
        });
    }
    else {
        // Students can only see their assigned classes
        init_1.db.all(`
      SELECT c.* FROM classes c
      INNER JOIN user_classes uc ON c.id = uc.class_id
      WHERE uc.user_id = ?
      ORDER BY c.name
    `, [userId], (err, classes) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(classes);
        });
    }
});
// Get class details with materials
router.get('/:id', auth_1.authenticateToken, (req, res) => {
    const classId = req.params.id;
    const userId = req.user.userId;
    const userRole = req.user.role;
    // Check if user has access to this class
    if (userRole === 'student') {
        init_1.db.get('SELECT * FROM user_classes WHERE user_id = ? AND class_id = ?', [userId, classId], (err, assignment) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!assignment) {
                return res.status(403).json({ error: 'Access denied to this class' });
            }
            getClassWithMaterials(classId, res);
        });
    }
    else {
        getClassWithMaterials(classId, res);
    }
});
function getClassWithMaterials(classId, res) {
    // Get class info
    init_1.db.get('SELECT * FROM classes WHERE id = ?', [classId], (err, classInfo) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!classInfo) {
            return res.status(404).json({ error: 'Class not found' });
        }
        // Get materials for this class
        init_1.db.all(`
      SELECT m.*, u.name as uploaded_by_name 
      FROM materials m
      LEFT JOIN users u ON m.uploaded_by = u.id
      WHERE m.class_id = ?
      ORDER BY m.type, m.created_at DESC
    `, [classId], (err, materials) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            // Group materials by type
            const lyrics = materials.filter((m) => m.type === 'lyrics');
            const recordings = materials.filter((m) => m.type === 'recording');
            res.json({
                ...classInfo,
                materials: {
                    lyrics,
                    recordings
                }
            });
        });
    });
}
// Save practice session
router.post('/:id/practice', auth_1.authenticateToken, (req, res) => {
    const classId = req.params.id;
    const userId = req.user.userId;
    const { duration, notes } = req.body;
    if (!duration || duration <= 0) {
        return res.status(400).json({ error: 'Valid duration is required' });
    }
    // Check if user has access to this class
    init_1.db.get('SELECT * FROM user_classes WHERE user_id = ? AND class_id = ?', [userId, classId], (err, assignment) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!assignment && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied to this class' });
        }
        // Save practice session
        init_1.db.run('INSERT INTO practice_sessions (user_id, class_id, duration, notes) VALUES (?, ?, ?, ?)', [userId, classId, duration, notes || ''], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to save practice session' });
            }
            res.json({
                message: 'Practice session saved successfully',
                sessionId: this.lastID
            });
        });
    });
});
// Get practice history for a class
router.get('/:id/practice-history', auth_1.authenticateToken, (req, res) => {
    const classId = req.params.id;
    const userId = req.user.userId;
    init_1.db.all(`
    SELECT ps.*, c.name as class_name
    FROM practice_sessions ps
    LEFT JOIN classes c ON ps.class_id = c.id
    WHERE ps.user_id = ? AND ps.class_id = ?
    ORDER BY ps.session_date DESC
    LIMIT 50
  `, [userId, classId], (err, sessions) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(sessions);
    });
});
exports.default = router;
//# sourceMappingURL=classes.js.map