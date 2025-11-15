import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { courseService } from "../../../services/courseService";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState (' ');

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
    try{
      event.preventDefault();
      await courseService.deleteCourse(id);
      navigate('/');
      
    } catch (err){
      console.error(err);
      setError('Failed to delete course')
    }

  }

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
    <button onClick={handleDelete}>Delete</button>

    </main>
  );
};

export default CourseDetails;
