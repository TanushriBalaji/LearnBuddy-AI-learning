import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
          setUser(userInfo);
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await axios.get('http://localhost:5000/api/progress', config);
          setProgress(data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.5rem' }}>Welcome, {user ? user.name : 'Student'}!</h2>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)', borderRadius: '1rem', fontSize: '0.875rem' }}>
            Skill Level: {user ? user.skillLevel : 'Beginner'}
          </span>
        </div>
      </div>
      
      {progress.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Your Progress</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {progress.map((prog, idx) => (
              <div key={idx} className="card" style={{ padding: '1.25rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>{prog.topic}</h4>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  <p>Lessons Completed: <strong style={{ color: 'var(--text-primary)' }}>{prog.completedLessonsCount}</strong></p>
                  <p>Highest Quiz Score: <strong style={{ color: 'var(--text-primary)' }}>{prog.highestQuizScore} / {prog.totalQuizQuestions}</strong></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Quick Links</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="card">
          <h3>My Learning Paths</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Resume where you left off.</p>
          <Link to="/topics" className="btn btn-primary" style={{ width: '100%' }}>View Tutorials</Link>
        </div>

        <div className="card">
          <h3>Quizzes & Assessments</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Test your knowledge.</p>
          <Link to="/topics" className="btn btn-outline" style={{ width: '100%' }}>Take a Quiz</Link>
        </div>

        <div className="card">
          <h3>AI Assistant</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Get help with complex concepts.</p>
          <Link to="/chat" className="btn btn-outline" style={{ width: '100%' }}>Ask AI</Link>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
