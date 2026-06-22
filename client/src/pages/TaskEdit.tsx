import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import type { Task } from '../types';

export default function TaskEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState('TODO');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data }: { data: Task } = await api.get(`/tasks/${id}`);
        setTitle(data.title);
        setCompleted(data.completed);
        setStatus(data.status);
      } catch {
        setError('Task not found');
      } finally {
        setFetching(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.put(`/tasks/${id}`, { title, completed, status });
      navigate('/tasks');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading...</p>;

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: '0 20px' }}>
      <h2>Edit Task</h2>
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
        <div style={{ marginBottom: 12 }}>
          <label>
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            Completed
          </label>
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
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
