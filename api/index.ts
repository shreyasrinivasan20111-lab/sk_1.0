import { db } from './database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method, url } = req;
  const path = url.replace('/api/', '');

  try {
    // Auth routes
    if (path.startsWith('auth/')) {
      const authPath = path.replace('auth/', '');
      
      if (authPath === 'login' && method === 'POST') {
        const { email, password } = req.body;
        
        return new Promise((resolve) => {
          db.get('SELECT * FROM users WHERE email = ?', [email], async (err: any, user: any) => {
            if (err || !user) {
              res.status(401).json({ error: 'Invalid credentials' });
              resolve(null);
              return;
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
              res.status(401).json({ error: 'Invalid credentials' });
              resolve(null);
              return;
            }

            const token = jwt.sign(
              { id: user.id, email: user.email, role: user.role },
              process.env.JWT_SECRET || 'fallback-secret',
              { expiresIn: '24h' }
            );

            res.status(200).json({
              token,
              user: { id: user.id, email: user.email, name: user.name, role: user.role }
            });
            resolve(null);
          });
        });
      }

      if (authPath === 'register' && method === 'POST') {
        const { email, password, name } = req.body;
        
        return new Promise((resolve) => {
          bcrypt.hash(password, 10, (err: any, hashedPassword: string) => {
            if (err) {
              res.status(500).json({ error: 'Server error' });
              resolve(null);
              return;
            }

            db.run(
              'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
              [email, hashedPassword, name, 'student'],
              function(this: any, err: any) {
                if (err) {
                  res.status(400).json({ error: 'User already exists' });
                  resolve(null);
                  return;
                }

                const token = jwt.sign(
                  { id: this.lastID, email, role: 'student' },
                  process.env.JWT_SECRET || 'fallback-secret',
                  { expiresIn: '24h' }
                );

                res.status(201).json({
                  token,
                  user: { id: this.lastID, email, name, role: 'student' }
                });
                resolve(null);
              }
            );
          });
        });
      }

      if (authPath === 'me' && method === 'GET') {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
          res.status(401).json({ error: 'No token provided' });
          return;
        }

        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
          
          return new Promise((resolve) => {
            db.get('SELECT id, email, name, role FROM users WHERE id = ?', [decoded.id], (err: any, user: any) => {
              if (err || !user) {
                res.status(401).json({ error: 'Invalid token' });
                resolve(null);
                return;
              }

              res.status(200).json(user);
              resolve(null);
            });
          });
        } catch (error) {
          res.status(401).json({ error: 'Invalid token' });
          return;
        }
      }
    }

    // Classes routes
    if (path === 'classes' && method === 'GET') {
      return new Promise((resolve) => {
        db.all('SELECT * FROM classes ORDER BY name', [], (err: any, classes: any) => {
          if (err) {
            res.status(500).json({ error: 'Database error' });
            resolve(null);
            return;
          }
          res.status(200).json(classes);
          resolve(null);
        });
      });
    }

    // Health check
    if (path === 'health' && method === 'GET') {
      res.status(200).json({ 
        status: 'OK', 
        message: 'Sai Kalpataru Course Management API is running on Vercel',
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Default 404
    res.status(404).json({ error: 'API endpoint not found' });
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
