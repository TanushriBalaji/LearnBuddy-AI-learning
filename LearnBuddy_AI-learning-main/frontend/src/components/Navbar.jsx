import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <nav style={{ padding: '1.5rem', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
        LearnBuddy
      </Link>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {userInfo ? (
          <>
            <Link to="/dashboard" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Dashboard</Link>
            <Link to="/topics" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Learning Paths</Link>
            <Link to="/chat" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>AI Assistant</Link>
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', marginLeft: '1rem' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
