import { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';

import { assignmentService } from '../../services/assignmentService';
import { AssignmentsContext } from '../../contexts/AssignmentContext';
import './AssignmentForm.css';

const initialState = { title: '', content: '' };

const AssignmentForm = () => {
  const {courseId} = useParams();
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { addAssignment } = useContext(AssignmentsContext);

  if (!courseId) {
    return <p>Error: No course selected. Please navigate from a course page.</p>;
  }

  const token = localStorage.getItem('token');

  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const newAssignment = await assignmentService.createAssignment({...formData, course: courseId,});
      addAssignment(newAssignment);
      setFormData(initialState);
      navigate(`/courses/${courseId}`);
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
        <button type="submit" className="btn">Add Assignment</button>
      </form>
    </main>
  );
};

export default AssignmentForm;
