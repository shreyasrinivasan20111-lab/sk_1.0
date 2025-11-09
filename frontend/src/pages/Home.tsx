import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Users, Clock, Shield } from 'lucide-react';
import './Home.css';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome To Sai Kalpataru
          </h1>
          <div className="mission-statement">
            <p>
              Sai Kalpataru Vidyalaya is a non-profit organization. It was formed in the year 2020, which began with teaching bhajans for young kids. Later, this evolved into a structured curriculum where shlokas from Vedic literature are taught throughout the academic year.
            </p>
            <p>
              The mission of this institution is to spread the word of Sanatana Dharma to the world and instill spiritual practice in young minds through recital of shlokas in Sanskrit language.
            </p>
          </div>
          
          {!user ? (
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Sign In
              </Link>
            </div>
          ) : (
            <div className="hero-actions">
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">About Sai Kalpataru Vidyalaya</h2>
          
          <div className="about-content">
            <div className="about-header">
              <h3>Sai Kalpataru Vidyalaya</h3>
              <p className="location">at Om Sri Sai Balaji Temple, Monroe, NJ</p>
              <p className="class-type">śloka & Sai Satcharitra Class</p>
              <div className="divider"></div>
            </div>
            
            <div className="about-body">
              <p className="greeting"><strong>Jai Sairam!</strong></p>
              
              <p className="intro-text">
                <strong>śravaṇaṃ</strong> is the beginner level śloka and Sai Satcharitra class. (Both new and the returning students are required to register using the LINK given in the last section of this document). If your child has already learned some śloka, we can evaluate for placement in the correct level.
              </p>
              
              <div className="class-details">
                <div className="detail-item">
                  <strong>When:</strong> Aug '25 to June '26. Class duration is 45 minutes, meeting once a week, on Saturdays.
                </div>
                <div className="detail-item">
                  <strong>Where:</strong> Online Zoom Class (link will be provided upon registration).
                </div>
                <div className="detail-item">
                  <strong>Who:</strong> For kids aged 5 years or older.
                </div>
                <div className="detail-item">
                  <strong>Medium of Instruction:</strong> English.
                </div>
              </div>
              
              <div className="how-it-works">
                <h4>How it Works:</h4>
                <ul>
                  <li>ślokas are based in Sanskrit language.</li>
                  <li>Lyrics will be in English language.</li>
                  <li>During the class, students will be made to repeat after the teacher.</li>
                  <li>Audio recording and lyrics will be provided for practice.</li>
                  <li>During the week, parents are required to work with kids to ensure they practice the previous week's lessons at home on a daily basis.</li>
                  <li>Prior week lessons will be revised in the class before beginning a new lesson.</li>
                  <li>Kids will listen to (from level 2, they will start reading) and discuss new stories from Shirdi Sai Satcharitra in the class.</li>
                  <li>Assessments will be held at the end of the year. Additionally, a minimum of 80% attendance is required to move on to the next level.</li>
                  <li>Students will get to recite in the temple for festivals, as schedule permits.</li>
                </ul>
              </div>
              
              <div className="graduation">
                <h4>Year-end Graduation Ceremony:</h4>
                <p>
                  Conducted in the Om Sai Balaji Temple, Monroe, NJ. All graduates will receive a certificate from the temple founder. Winners will receive trophies and medals. Out of state graduates will get the certificates via regular mail.
                </p>
              </div>
              
              <div className="donation">
                <h4>Suggested Donation:</h4>
                <p>
                  As a contribution towards the Hanuman tower construction in the Om Sai Balaji Temple, Monroe NJ, we suggest a donation of $100 per child per year.
                </p>
                <p>Payment details will be given upon enrollment.</p>
              </div>
              
              <div className="registration">
                <h4>Registration:</h4>
                <p>
                  <strong>Registration Link:</strong> <a href="https://docs.google.com/document/d/1AbtC_oGg_Pb-PXhpJiUUaS4N_sTWb83D/edit" target="_blank" rel="noopener noreferrer" className="registration-link">
                    Click here to register
                  </a>
                </p>
                <p style={{fontSize: '0.9rem', color: '#8e44ad', marginTop: '10px', fontStyle: 'italic'}}>
                  If the link doesn't work, please copy and paste this URL in your browser:<br/>
                  <code style={{background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem'}}>
                    https://docs.google.com/document/d/1AbtC_oGg_Pb-PXhpJiUUaS4N_sTWb83D/edit
                  </code>
                </p>
                <p className="registration-note">
                  (If you're registering more than one child, please submit the form again with the details of the second child (i.e. one form per child).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

   
    </div>
  );
};

export default Home;
