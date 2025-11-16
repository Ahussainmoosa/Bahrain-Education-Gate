import { useParams, Link, useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { courseService } from "../../../services/courseService";
import { UserContext } from "../../../contexts/UserContext";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await courseService.getCourse(id);
        setCourse(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load course');
      }
    };

    fetchCourse();
  }, [id]);

  const handleDelete = async (event) => {
    try {
      event.preventDefault();
      await courseService.deleteCourse(id);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Failed to delete course');
    }
  };

  if (!course) return <p>Loading course details...</p>;

  return (
    <main>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {user.role === 'school' && (
        <>
          <Link to={`/courses/${course._id}/edit`}>Edit {course.title}</Link>
          <button onClick={handleDelete}>Delete</button>
          <Link to={`/courses/${course._id}/assignments/new`}>Create Assignment</Link>
        </>
      )}

      <Link to={`/courses/${course._id}/assignments`}>Course Assignments</Link>
    </main>
  );
};

export default CourseDetails;