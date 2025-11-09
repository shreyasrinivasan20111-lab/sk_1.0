"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const init_1 = require("../database/init");
const auth_1 = require("./auth");
const router = express_1.default.Router();
// Middleware to check admin role
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
// Get all students
router.get('/students', auth_1.authenticateToken, requireAdmin, (req, res) => {
    init_1.db.all(`
    SELECT u.id, u.email, u.name, u.created_at,
           GROUP_CONCAT(c.name) as assigned_classes
    FROM users u
    LEFT JOIN user_classes uc ON u.id = uc.user_id
    LEFT JOIN classes c ON uc.class_id = c.id
    WHERE u.role = 'student'
    GROUP BY u.id, u.email, u.name, u.created_at
    ORDER BY u.name
  `, (err, students) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(students);
    });
});
// Get unassigned students
router.get('/students/unassigned', auth_1.authenticateToken, requireAdmin, (req, res) => {
    init_1.db.all(`
    SELECT u.id, u.email, u.name, u.created_at
    FROM users u
    LEFT JOIN user_classes uc ON u.id = uc.user_id
    WHERE u.role = 'student' AND uc.user_id IS NULL
    ORDER BY u.name
  `, (err, students) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(students);
    });
});
// Assign student to class
router.post('/assign-class', auth_1.authenticateToken, requireAdmin, (req, res) => {
    const { studentId, classId } = req.body;
    if (!studentId || !classId) {
        return res.status(400).json({ error: 'Student ID and Class ID are required' });
    }
    init_1.db.run('INSERT OR IGNORE INTO user_classes (user_id, class_id) VALUES (?, ?)', [studentId, classId], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to assign class' });
        }
        res.json({ message: 'Class assigned successfully' });
    });
});
// Remove student from class
router.delete('/remove-class', auth_1.authenticateToken, requireAdmin, (req, res) => {
    const { studentId, classId } = req.body;
    if (!studentId || !classId) {
        return res.status(400).json({ error: 'Student ID and Class ID are required' });
    }
    init_1.db.run('DELETE FROM user_classes WHERE user_id = ? AND class_id = ?', [studentId, classId], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to remove class assignment' });
        }
        res.json({ message: 'Class assignment removed successfully' });
    });
});
// Get student's assigned classes
router.get('/students/:id/classes', auth_1.authenticateToken, requireAdmin, (req, res) => {
    const studentId = req.params.id;
    init_1.db.all(`
    SELECT c.*, uc.assigned_at
    FROM classes c
    INNER JOIN user_classes uc ON c.id = uc.class_id
    WHERE uc.user_id = ?
    ORDER BY c.name
  `, [studentId], (err, classes) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(classes);
    });
});
// Get all practice sessions (for admin dashboard)
router.get('/practice-sessions', auth_1.authenticateToken, requireAdmin, (req, res) => {
    const { limit = 100 } = req.query;
    init_1.db.all(`
    SELECT ps.*, u.name as student_name, u.email as student_email, c.name as class_name
    FROM practice_sessions ps
    LEFT JOIN users u ON ps.user_id = u.id
    LEFT JOIN classes c ON ps.class_id = c.id
    ORDER BY ps.session_date DESC
    LIMIT ?
  `, [limit], (err, sessions) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(sessions);
    });
});
// Get practice statistics
router.get('/stats', auth_1.authenticateToken, requireAdmin, (req, res) => {
    const queries = [
        // Total students
        'SELECT COUNT(*) as total_students FROM users WHERE role = "student"',
        // Total practice sessions
        'SELECT COUNT(*) as total_sessions FROM practice_sessions',
        // Total practice time
        'SELECT SUM(duration) as total_duration FROM practice_sessions',
        // Students by class
        `SELECT c.name as class_name, COUNT(uc.user_id) as student_count
     FROM classes c
     LEFT JOIN user_classes uc ON c.id = uc.class_id
     GROUP BY c.id, c.name`,
    ];
    const stats = {};
    // Execute queries sequentially
    init_1.db.get(queries[0], (err, result) => {
        if (err)
            return res.status(500).json({ error: 'Database error' });
        stats.totalStudents = result?.total_students || 0;
        init_1.db.get(queries[1], (err, result) => {
            if (err)
                return res.status(500).json({ error: 'Database error' });
            stats.totalSessions = result?.total_sessions || 0;
            init_1.db.get(queries[2], (err, result) => {
                if (err)
                    return res.status(500).json({ error: 'Database error' });
                stats.totalDuration = result?.total_duration || 0;
                init_1.db.all(queries[3], (err, results) => {
                    if (err)
                        return res.status(500).json({ error: 'Database error' });
                    stats.studentsByClass = results;
                    res.json(stats);
                });
            });
        });
    });
});
exports.default = router;
//# sourceMappingURL=admin.js.map