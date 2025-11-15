import { Link } from 'react-router';

const AssignmentList = ({ assignments = [], deleteAssignment }) => {
  return (
    <>
      <h2>Assignments</h2>

      {assignments.length === 0 ? (
        <p>No assignments yet!</p>
      ) : (
        <ul>
          {assignments.map((assignment) => (
            <li key={assignment._id}>
              <Link to={`/assignments/${assignment._id}`}>
                {assignment.title}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link to='/assignments/new'>Create New Assignment</Link>
    </>
  );
};

export default AssignmentList;
