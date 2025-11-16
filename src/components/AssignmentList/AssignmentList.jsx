import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ASSIGN_API_URL = "http://localhost:3000/assignments";

function AssignmentList() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch(ASSIGN_API_URL, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error("Failed to fetch assignments");
        }

        const data = await res.json();
        setAssignments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [token]);

  if (loading) return <p>Loading assignments...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

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

      <Link to="/assignments/new">Create New Assignment</Link>
    </>
  );
}

export default AssignmentList;
