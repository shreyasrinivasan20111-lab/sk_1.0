import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { BookOpen, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import API_BASE_URL from '../config/api';
import './Dashboard.css';

interface Class {
  id: number;
  name: string;
  description: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/classes`);
      setClasses(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your classes...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p>
          {user?.role === 'admin' 
            ? 'You have admin access to all classes and student management.' 
            : classes.length > 0 
              ? `You have access to ${classes.length} class${classes.length !== 1 ? 'es' : ''}.`
              : 'You have not been assigned to any classes yet. Please contact your administrator.'
          }
        </p>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {classes.length === 0 && !error ? (
        <div className="no-classes">
          <BookOpen size={64} />
          <h3>No Classes Available</h3>
          <p>
            {user?.role === 'admin' 
              ? 'All classes are available to you as an admin.' 
              : 'You have not been assigned to any classes yet. Please contact your administrator to get access to classes.'
            }
          </p>
        </div>
      ) : (
        <div className="classes-section">
          <h2>Your Classes</h2>
          <div className="classes-grid">
            {classes.map((classItem) => (
              <Link
                key={classItem.id}
                to={`/class/${classItem.id}`}
                className="class-card-link"
              >
                <div className="class-card">
                  <div className="class-icon">
                    <BookOpen size={32} />
                  </div>
                  <div className="class-info">
                    <h3>{classItem.name}</h3>
                    <p>{classItem.description}</p>
                  </div>
                  <div className="class-arrow">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="dashboard-features">
        <div className="feature-grid">
          <div className="feature-item">
            <div className="feature-icon-small">
              <BookOpen size={24} />
            </div>
            <div>
              <h4>Learning Materials</h4>
              <p>Access lyrics and recordings in each class</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-small">
              <Clock size={24} />
            </div>
            <div>
              <h4>Practice Timer</h4>
              <p>Track your practice sessions and progress</p>
            </div>
          </div>

          {user?.role === 'admin' && (
            <div className="feature-item">
              <Link to="/admin" className="admin-link">
                <div className="feature-icon-small">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h4>Admin Panel</h4>
                  <p>Manage students and upload materials</p>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
