// src/components/course/CreateCourse.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import './CourseEdit/CourseEdit.css';

const CreateCourse = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:3000/courses/new', {
        method: 'POST',
        headers: {'Content-Type': 'application/json','Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create course');

      const data = await res.json();
      console.log('Course created:', data);

      setMessage('Course created successfully!');
      setFormData({ title: '', description: '' });

      navigate('/courses');
    } catch (err) {
      console.error(err);
      setMessage('Error creating course');
    }
  };

  return (
    <div>
      <h2>Create Course</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Course Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Course Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <button type="submit" className="btn">Create Course</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateCourse;
