import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [courses, setCourses] = useState([]);


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch('http://localhost:3000/courses',{
          headers: {'Content-Type': 'application/json','Authorization': `Bearer ${token}`,
        }
        });
        if (!res.ok) throw new Error('Failed to fetch courses');
        const data = await res.json();
        if (Array.isArray(data)) setCourses(data);
        else setCourses([]);
      } catch (err) {
        console.error(err);
        setCourses([]);
      }
    };
    fetchCourses();
  }, []);

  if (!user) return <p>Loading user...</p>;

  return (
    <main>
      <div>
        <h2>Welcome, {user.username}</h2>
        <h1>Your Courses</h1>
        {courses.length === 0 ? (
        <p>No courses available!</p>
      ) : (
        <ul>
          {courses.map(course => (
            <li key={course._id}>
              <Link to={`/courses/${course._id}`}>
                <h2>{course.title} </h2>
              </Link>
            </li>
          ))}
        </ul>
      )}
      
      {user.role === 'school' && (
        <Link to='/courses/new'>Creat New Course</Link>

      )}

      </div>
      
    </main>
  );
};

export default Dashboard;

