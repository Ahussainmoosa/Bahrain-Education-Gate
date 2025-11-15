import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { assignmentService } from '../../services/assignmentService';

const AssignmentDetails = ({ deleteAssignment }) => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const data = await assignmentService.getAssignment(id);
        setAssignment(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAssignment();
  }, [id]);

  if (!assignment) return <p>Loading...</p>;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await assignmentService.deleteAssignment(id);
      deleteAssignment && deleteAssignment(id);
      navigate('/assignments');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>{assignment.title}</h2>
      <p>{assignment.content}</p>

      <div style={{ marginTop: '1rem' }}>
        <Link to={`/assignments/${id}/edit`}>
          <button>Edit</button>
        </Link>
        <button onClick={handleDelete} style={{ marginLeft: '0.5rem' }}>
          Delete
        </button>
      </div>

      <Link to='/assignments' style={{ display: 'block', marginTop: '1rem' }}>
        Back to assignments
      </Link>
    </div>
  );
};

export default AssignmentDetails;
