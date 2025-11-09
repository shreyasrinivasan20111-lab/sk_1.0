import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Settings } from 'lucide-react';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Sai Kalpataru
        </Link>
        
        <div className="navbar-menu">
          {user ? (
            <div className="navbar-user">
              <span className="user-welcome">
                Welcome, {user.name}
                {user.role === 'admin' && <span className="admin-badge">Admin</span>}
              </span>
              
              <div className="dropdown">
                <button className="dropdown-toggle">
                  <User size={20} />
                </button>
                
                <div className="dropdown-menu">
                  <Link to="/dashboard" className="dropdown-item">
                    Dashboard
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="dropdown-item">
                      <Settings size={16} />
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="dropdown-item">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="auth-link">
                Login
              </Link>
              <Link to="/register" className="auth-link register">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
