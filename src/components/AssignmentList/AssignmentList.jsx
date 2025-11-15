import { Link } from "react-router";

const AssignmentList = (props) => {
  return (
    <>
      <h2>Assignment</h2>
      <ul>
        {props.assignment.map((currentAssignment) => (
          <li key={currentAssignment.name}>
            <Link to={`/assignment/${currentAssignment._id}`}>
            {currentAssignment.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default AssignmentList;