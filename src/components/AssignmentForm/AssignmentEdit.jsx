import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { assignmentService } from '../../services/assignmentService';

const AssignmentEdit = ({ updateAssignment }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({ title: '', content: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const data = await assignmentService.getAssignment(id);
        setFormData({ title: data.title, content: data.content });
      } catch (err) {
        console.error(err);
      }
    };
    fetchAssignment();
  }, [id]);

  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const updated = await assignmentService.updateAssignment(id, formData);
      updateAssignment && updateAssignment(updated);
      navigate('/assignments');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main>
      <h2>Edit Assignment</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Assignment Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <label htmlFor="content">Assignment Content:</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
        />
        <button type="submit">Update Assignment</button>
      </form>
    </main>
  );
};

export default AssignmentEdit;
