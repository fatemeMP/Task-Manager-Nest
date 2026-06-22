import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(email, password);
      navigate('/tasks');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: '0 20px' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: '#e94560' }}>{error}</p>}
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4, boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4, boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4, boxSizing: 'border-box' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 10,
            backgroundColor: '#e94560',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p style={{ marginTop: 16, textAlign: 'center' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
