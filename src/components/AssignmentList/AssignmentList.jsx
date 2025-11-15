import { Link } from "react-router";

const AssignmentList = (props) => {
  const { user } = useContext(UserContext);
  const [assignments, setAssignments] = useState([]);
  return (
    <>
      <h2>Assignment</h2>
      {assignment.length === 0 ? (
        <p>No assignments yet!</p>
      ) : (
        <ul>
        {props.assignment.map((currentAssignment) => (
          <li key={currentAssignment.name}>
            <Link to={`/assignment/${currentAssignment._id}`}>
            {currentAssignment.name}
            </Link>
          </li>
        ))}
      </ul>
      )}
    
      <Link to='/assignments/new'>Creat New assignment</Link>
    </>
  );
};

export default AssignmentList;