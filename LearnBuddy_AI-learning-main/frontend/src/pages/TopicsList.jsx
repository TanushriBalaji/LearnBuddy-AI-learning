import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TopicsList = () => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/learning/topics', config);
        setTopics(data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };
    fetchTopics();
  }, []);

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '2rem' }}>Learning Topics</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {topics.map(topic => (
          <div key={topic._id} className="card">
            <h3>{topic.title}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{topic.description}</p>
            <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)', borderRadius: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {topic.difficulty}
            </span>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to={`/topic/${topic._id}`} className="btn btn-primary" style={{ flex: 1 }}>Start</Link>
              <Link to={`/quiz/${topic._id}`} className="btn btn-outline" style={{ flex: 1 }}>Quiz</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicsList;
