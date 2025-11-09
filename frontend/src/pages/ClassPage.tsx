import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { ArrowLeft, Play, Pause, Square, FileText, Music, Upload, AlertCircle, Clock } from 'lucide-react';
import './ClassPage.css';

interface Material {
  id: number;
  title: string;
  type: 'lyrics' | 'recording';
  file_path?: string;
  content?: string;
  uploaded_by_name: string;
  created_at: string;
}

interface ClassData {
  id: number;
  name: string;
  description: string;
  materials: {
    lyrics: Material[];
    recordings: Material[];
  };
}

const ClassPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [practiceNotes, setPracticeNotes] = useState('');

  // Upload state
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    type: 'lyrics' as 'lyrics' | 'recording',
    content: '',
    file: null as File | null
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchClassData();
    }
  }, [id]);

  // Timer effect
  useEffect(() => {
    let interval: number;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const fetchClassData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/classes/${id}`);
      setClassData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load class data');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => setIsTimerRunning(true);
  const pauseTimer = () => setIsTimerRunning(false);
  const stopTimer = async () => {
    setIsTimerRunning(false);
    
    if (timerSeconds > 0) {
      try {
        await axios.post(`http://localhost:3001/api/classes/${id}/practice`, {
          duration: timerSeconds,
          notes: practiceNotes
        });
        
        // Reset timer
        setTimerSeconds(0);
        setPracticeNotes('');
        alert('Practice session saved successfully!');
      } catch (err: any) {
        alert('Failed to save practice session: ' + (err.response?.data?.error || 'Unknown error'));
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title || (!uploadForm.file && !uploadForm.content)) {
      alert('Please provide a title and either a file or content');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('classId', id!);
    formData.append('title', uploadForm.title);
    formData.append('type', uploadForm.type);
    
    if (uploadForm.file) {
      formData.append('file', uploadForm.file);
    }
    if (uploadForm.content) {
      formData.append('content', uploadForm.content);
    }

    try {
      await axios.post('http://localhost:3001/api/upload/material', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setShowUpload(false);
      setUploadForm({ title: '', type: 'lyrics', content: '', file: null });
      fetchClassData(); // Refresh data
      alert('Material uploaded successfully!');
    } catch (err: any) {
      alert('Upload failed: ' + (err.response?.data?.error || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading class...</p>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="error-container">
        <AlertCircle size={48} />
        <h2>Error</h2>
        <p>{error || 'Class not found'}</p>
        <Link to="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="class-page">
      <div className="class-header">
        <Link to="/dashboard" className="back-link">
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>
        
        <div className="class-title">
          <h1>{classData.name}</h1>
          <p>{classData.description}</p>
        </div>

        {user?.role === 'admin' && (
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="btn btn-primary"
          >
            <Upload size={20} />
            Upload Material
          </button>
        )}
      </div>

      {showUpload && user?.role === 'admin' && (
        <div className="upload-section">
          <h3>Upload New Material</h3>
          <form onSubmit={handleUpload} className="upload-form">
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Type</label>
                <select
                  value={uploadForm.type}
                  onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value as 'lyrics' | 'recording' })}
                >
                  <option value="lyrics">Lyrics</option>
                  <option value="recording">Recording</option>
                </select>
              </div>
            </div>

            {uploadForm.type === 'lyrics' && (
              <div className="form-group">
                <label>Content (optional if uploading file)</label>
                <textarea
                  value={uploadForm.content}
                  onChange={(e) => setUploadForm({ ...uploadForm, content: e.target.value })}
                  rows={6}
                  placeholder="Enter lyrics content here..."
                />
              </div>
            )}

            <div className="form-group">
              <label>File (optional)</label>
              <input
                type="file"
                onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                accept={uploadForm.type === 'lyrics' ? '.txt,.pdf' : 'audio/*,video/*'}
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
              <button type="button" onClick={() => setShowUpload(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="class-content">
        <div className="materials-section">
          <div className="material-box">
            <div className="material-header">
              <FileText size={24} />
              <h2>Lyrics</h2>
            </div>
            
            <div className="materials-list">
              {classData.materials.lyrics.length === 0 ? (
                <p className="no-materials">No lyrics available yet</p>
              ) : (
                classData.materials.lyrics.map((material) => (
                  <div key={material.id} className="material-item">
                    <h4>{material.title}</h4>
                    {material.content && (
                      <div className="material-content">
                        <pre>{material.content}</pre>
                      </div>
                    )}
                    {material.file_path && (
                      <a 
                        href={`http://localhost:3001${material.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="material-link"
                      >
                        View File
                      </a>
                    )}
                    <p className="material-meta">
                      Uploaded by {material.uploaded_by_name} on {new Date(material.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="material-box">
            <div className="material-header">
              <Music size={24} />
              <h2>Recordings</h2>
            </div>
            
            <div className="materials-list">
              {classData.materials.recordings.length === 0 ? (
                <p className="no-materials">No recordings available yet</p>
              ) : (
                classData.materials.recordings.map((material) => (
                  <div key={material.id} className="material-item">
                    <h4>{material.title}</h4>
                    {material.file_path && (
                      <div className="audio-player">
                        <audio controls>
                          <source src={`http://localhost:3001${material.file_path}`} />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                    <p className="material-meta">
                      Uploaded by {material.uploaded_by_name} on {new Date(material.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="timer-section">
          <div className="timer-box">
            <div className="timer-header">
              <Clock size={24} />
              <h2>Practice Timer</h2>
            </div>
            
            <div className="timer-display">
              <div className="timer-time">{formatTime(timerSeconds)}</div>
            </div>
            
            <div className="timer-controls">
              {!isTimerRunning ? (
                <button onClick={startTimer} className="timer-btn start">
                  <Play size={20} />
                  Start
                </button>
              ) : (
                <button onClick={pauseTimer} className="timer-btn pause">
                  <Pause size={20} />
                  Pause
                </button>
              )}
              
              <button 
                onClick={stopTimer} 
                className="timer-btn stop"
                disabled={timerSeconds === 0}
              >
                <Square size={20} />
                Stop & Save
              </button>
            </div>

            <div className="timer-notes">
              <label>Practice Notes (optional)</label>
              <textarea
                value={practiceNotes}
                onChange={(e) => setPracticeNotes(e.target.value)}
                placeholder="Add notes about your practice session..."
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassPage;
