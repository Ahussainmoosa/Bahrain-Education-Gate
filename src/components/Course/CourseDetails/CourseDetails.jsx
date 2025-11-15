import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/courses/${id}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load course details");

        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourse();
  }, [id]);

  if (!course) return <p>Loading course details...</p>;

  return (
    <main>
      <h1>{course.title}</h1>
      <p>{course.description}</p>

      <h3>Enrolled Students:</h3>
      {course.enrolledStudents.length === 0 ? (
        <p>No students enrolled yet.</p>
      ) : (
        <ul>
          {course.enrolledStudents.map(student => (
            <li key={student._id}>{student.username}</li>
          ))}
        </ul>
      )}
    <Link to={`/courses/${course._id}/edit`}>Edit {course.title}</Link>

    </main>
  );
};

export default CourseDetails;
