import { useState } from 'react';
import { useNavigate } from 'react-router';

const initialState = { title: '', content: '' };

const AssignmentForm = ({ addAssignment }) => {
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:3000/assignments/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.err || 'Failed to create assignment');
      }

      const newAssignment = await res.json();
      addAssignment && addAssignment(newAssignment);
      setFormData(initialState);
      navigate('/assignments');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <h2>New Assignment</h2>

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

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Assignment'}
        </button>
      </form>
    </main>
  );
};

export default AssignmentForm;
