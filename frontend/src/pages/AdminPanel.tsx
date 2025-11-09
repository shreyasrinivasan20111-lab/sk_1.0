import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Clock, UserPlus, UserMinus, BarChart3 } from 'lucide-react';
import getApiBaseUrl from '../config/api';
import './AdminPanel.css';

interface Student {
  id: number;
  email: string;
  name: string;
  created_at: string;
  assigned_classes?: string;
}

interface Class {
  id: number;
  name: string;
  description: string;
}

interface PracticeSession {
  id: number;
  student_name: string;
  student_email: string;
  class_name: string;
  duration: number;
  session_date: string;
  notes?: string;
}

interface Stats {
  totalStudents: number;
  totalSessions: number;
  totalDuration: number;
  studentsByClass: Array<{ class_name: string; student_count: number }>;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'students' | 'sessions' | 'stats'>('students');
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Assignment state
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);

  useEffect(() => {
    fetchClasses();
    if (activeTab === 'students') {
      fetchStudents();
    } else if (activeTab === 'sessions') {
      fetchSessions();
    } else if (activeTab === 'stats') {
      fetchStats();
    }
  }, [activeTab]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${getApiBaseUrl()}/admin/students`);
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${getApiBaseUrl()}/classes`);
      setClasses(response.data);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    }
  };

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${getApiBaseUrl()}/admin/practice-sessions`);
      setSessions(response.data);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${getApiBaseUrl()}/admin/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const assignClass = async () => {
    if (!selectedStudent || !selectedClass) {
      alert('Please select both a student and a class');
      return;
    }

    try {
      await axios.post(`${getApiBaseUrl()}/admin/assign-class`, {
        studentId: selectedStudent,
        classId: selectedClass
      });
      
      alert('Class assigned successfully!');
      fetchStudents(); // Refresh the list
      setSelectedStudent(null);
      setSelectedClass(null);
    } catch (error: any) {
      alert('Failed to assign class: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const removeClassAssignment = async (studentId: number, className: string) => {
    const classToRemove = classes.find(c => c.name === className);
    if (!classToRemove) return;

    if (!confirm(`Remove ${className} assignment for this student?`)) return;

    try {
      await axios.delete(`${getApiBaseUrl()}/admin/remove-class`, {
        data: { studentId, classId: classToRemove.id }
      });
      
      alert('Class assignment removed successfully!');
      fetchStudents(); // Refresh the list
    } catch (error: any) {
      alert('Failed to remove class assignment: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Manage students, classes, and monitor practice sessions</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          <Users size={20} />
          Students
        </button>
        <button
          className={`tab-button ${activeTab === 'sessions' ? 'active' : ''}`}
          onClick={() => setActiveTab('sessions')}
        >
          <Clock size={20} />
          Practice Sessions
        </button>
        <button
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <BarChart3 size={20} />
          Statistics
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'students' && (
          <div className="students-section">
            <div className="assign-section">
              <h3>Assign Student to Class</h3>
              <div className="assign-form">
                <select
                  value={selectedStudent || ''}
                  onChange={(e) => setSelectedStudent(Number(e.target.value) || null)}
                >
                  <option value="">Select Student</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.email})
                    </option>
                  ))}
                </select>

                <select
                  value={selectedClass || ''}
                  onChange={(e) => setSelectedClass(Number(e.target.value) || null)}
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>

                <button onClick={assignClass} className="btn btn-primary">
                  <UserPlus size={16} />
                  Assign Class
                </button>
              </div>
            </div>

            <div className="students-list">
              <h3>All Students</h3>
              {loading ? (
                <div className="loading">Loading students...</div>
              ) : (
                <div className="table-container">
                  <table className="students-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Registered</th>
                        <th>Assigned Classes</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(student => (
                        <tr key={student.id}>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>{formatDate(student.created_at)}</td>
                          <td>
                            {student.assigned_classes ? (
                              <div className="assigned-classes">
                                {student.assigned_classes.split(',').map((className, index) => (
                                  <span key={index} className="class-badge">
                                    {className.trim()}
                                    <button
                                      onClick={() => removeClassAssignment(student.id, className.trim())}
                                      className="remove-class-btn"
                                      title="Remove class"
                                    >
                                      <UserMinus size={12} />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="no-classes">No classes assigned</span>
                            )}
                          </td>
                          <td>
                            <button
                              onClick={() => setSelectedStudent(student.id)}
                              className="btn btn-small"
                            >
                              Assign Class
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="sessions-section">
            <h3>Recent Practice Sessions</h3>
            {loading ? (
              <div className="loading">Loading sessions...</div>
            ) : (
              <div className="table-container">
                <table className="sessions-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Class</th>
                      <th>Duration</th>
                      <th>Date</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map(session => (
                      <tr key={session.id}>
                        <td>
                          <div>
                            <div className="student-name">{session.student_name}</div>
                            <div className="student-email">{session.student_email}</div>
                          </div>
                        </td>
                        <td>{session.class_name}</td>
                        <td className="duration">{formatDuration(session.duration)}</td>
                        <td>{formatDate(session.session_date)}</td>
                        <td className="notes">{session.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-section">
            <h3>Overview Statistics</h3>
            {loading ? (
              <div className="loading">Loading statistics...</div>
            ) : stats ? (
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <Users size={32} />
                  </div>
                  <div className="stat-info">
                    <h4>Total Students</h4>
                    <p className="stat-number">{stats.totalStudents}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <Clock size={32} />
                  </div>
                  <div className="stat-info">
                    <h4>Practice Sessions</h4>
                    <p className="stat-number">{stats.totalSessions}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <BarChart3 size={32} />
                  </div>
                  <div className="stat-info">
                    <h4>Total Practice Time</h4>
                    <p className="stat-number">{formatDuration(stats.totalDuration)}</p>
                  </div>
                </div>

                <div className="class-stats">
                  <h4>Students by Class</h4>
                  <div className="class-stats-list">
                    {stats.studentsByClass.map((item, index) => (
                      <div key={index} className="class-stat-item">
                        <span className="class-name">{item.class_name}</span>
                        <span className="student-count">{item.student_count} students</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
