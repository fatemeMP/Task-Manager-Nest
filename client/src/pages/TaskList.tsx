import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Task } from '../types';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.data);
      setError('');
    } catch (err: any) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch {
      alert('Failed to delete task');
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Tasks</h2>
        <Link
          to="/tasks/new"
          style={{
            padding: '8px 16px',
            backgroundColor: '#e94560',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: 4,
          }}
        >
          + New Task
        </Link>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: '#e94560' }}>{error}</p>}
      {!loading && tasks.length === 0 && <p>No tasks yet. Create one!</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              border: '1px solid #333',
              padding: '12px 16px',
              marginBottom: 8,
              borderRadius: 6,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <strong style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.title}
              </strong>
              <span
                style={{
                  marginLeft: 10,
                  fontSize: '0.8rem',
                  padding: '2px 8px',
                  borderRadius: 4,
                  backgroundColor:
                    task.status === 'DONE'
                      ? '#2ecc71'
                      : task.status === 'IN_PROGRESS'
                        ? '#f39c12'
                        : '#3498db',
                  color: '#fff',
                }}
              >
                {task.status}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link
                to={`/tasks/${task.id}/edit`}
                style={{ color: '#3498db', textDecoration: 'none' }}
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(task.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#e94560',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
