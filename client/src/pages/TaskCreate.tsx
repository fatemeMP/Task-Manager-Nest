import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function TaskCreate() {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('TODO');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/tasks', { title, status });
      navigate('/tasks');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: '0 20px' }}>
      <h2>Create Task</h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: '#e94560' }}>{error}</p>}
        <div style={{ marginBottom: 12 }}>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4, boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: '100%', padding: 8, marginTop: 4, boxSizing: 'border-box' }}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
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
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
}
