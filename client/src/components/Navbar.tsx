import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      style={{
        padding: '12px 24px',
        backgroundColor: '#1a1a2e',
        color: '#eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Link to="/tasks" style={{ color: '#e94560', fontSize: '1.4rem', fontWeight: 'bold', textDecoration: 'none' }}>
        📝 Task Manager
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isAuthenticated ? (
          <>
            <span style={{ fontSize: '0.9rem', color: '#aaa' }}>{user?.email}</span>
            <button
              onClick={handleLogout}
              style={{
                padding: '6px 14px',
                backgroundColor: '#e94560',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#aaa', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: '#aaa', textDecoration: 'none' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
