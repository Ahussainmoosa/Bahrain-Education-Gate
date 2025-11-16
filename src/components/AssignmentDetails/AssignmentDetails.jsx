import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { assignmentService } from '../../services/assignmentService';
import './AssignmentDetails.css';


const AssignmentDetails = ({ deleteAssignment }) => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  // Fetch the assignment details
  useEffect(() => {
    
    const fetchAssignment = async () => {
      try {
        const res = await fetch(`http://localhost:3000/assignments/${id}`);
        if (!res.ok) throw new Error('Failed to fetch assignment');
        const data = await res.json();
        setAssignment(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Something went wrong');
      }
    };
    fetchAssignment();
  }, [id]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!assignment) return <p>Loading...</p>;

  const handleDelete = async () => {
   
    try {
      const res = await fetch(`http://localhost:3000/assignments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // ✅ include token
        },
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.err || 'Failed to delete assignment');
      }

      deleteAssignment && deleteAssignment(id);
      navigate('/assignments');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to delete assignment');
    }
  };

  return (
    <div>
      <h2>{assignment.title}</h2>
      <p>{assignment.content}</p>
      {assignment.course && (
      <p>
        <strong>Course:</strong>{' '}
        <Link to={`/courses/${assignment.course._id}`}>
          {assignment.course.title}
        </Link>
      </p>
      )}
      <div style={{ marginTop: '1rem' }}>
        <Link to={`/assignments/${id}/edit`}>
          <button>Edit</button>
        </Link>
        <button
          onClick={handleDelete}
          style={{
            marginLeft: '0.5rem',
            backgroundColor: 'red',
            color: 'white',
            cursor: 'pointer',
            border: 'none',
            padding: '5px 10px',
          }}
        >
          Delete
        </button>
      </div>

      <Link to='/assignments' className="btn">

        Back to assignments
      </Link>
    </div>
  );
};

export default AssignmentDetails;
