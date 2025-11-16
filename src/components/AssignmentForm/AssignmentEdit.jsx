import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { assignmentService } from '../../services/assignmentService';
import './AssignmentEdit.css';

const AssignmentEdit = ({ updateAssignment }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await fetch(`http://localhost:3000/assignments/${id}`);
        if (!res.ok) throw new Error('Failed to fetch assignment');
        const data = await res.json();
        setFormData({ title: data.title, content: data.content });
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load assignment');
      }
    };
    fetchAssignment();
  }, [id]);

  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:3000/assignments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.err || 'Failed to update assignment');
      }

      const updated = await res.json();
      updateAssignment && updateAssignment(updated);
      navigate('/assignments');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <h2>Edit Assignment</h2>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Assignment Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="content">Assignment Content:</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn">Update Assignment</button>
      </form>
    </main>
  );
};

export default AssignmentEdit;
