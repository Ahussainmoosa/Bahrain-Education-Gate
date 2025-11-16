import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Base URL for course operations
const COURSE_API_BASE_URL = 'http://localhost:3000/courses'; 
// Base URL for fetching the student list (assuming app.use('/users', ...))
const USER_API_BASE_URL = 'http://localhost:3000/users'; 

function CourseEdit() {
    const { courseId } = useParams(); 
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // 1. STATE INITIALIZATION (enrolledStudents must be an array)
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        enrolledStudents: [], // Initialize as an empty array
    });
    
    // New state to hold the list of students fetched from the backend
    const [availableStudents, setAvailableStudents] = useState([]); 
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    /**
     * Effect to fetch both the course data AND the available students.
     */
    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                setError("Authentication token is missing.");
                setLoading(false);
                return;
            }

            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            };

            try {
                // 1. FETCH COURSE DATA (GET /courses/:courseId/edit)
                const courseRes = await fetch(`${COURSE_API_BASE_URL}/${courseId}/edit`, { headers });
                if (!courseRes.ok) {
                    const errorBody = await courseRes.json().catch(() => ({}));
                    throw new Error(errorBody.err || 'Failed to load course details.');
                }
                const course = await courseRes.json();
                
                // Ensure enrolledStudents is an array when setting state
                course.enrolledStudents = course.enrolledStudents || []; 
                setCourseData(course);

                // 2. FETCH AVAILABLE STUDENTS (GET /users?role=student)
                const studentsRes = await fetch(`${USER_API_BASE_URL}?role=student`, { headers });
                if (!studentsRes.ok) {
                    throw new Error('Failed to load student list.');
                }
                const students = await studentsRes.json();
                setAvailableStudents(students);
                
                setLoading(false);

            } catch (err) {
                console.error('Fetch Error:', err);
                setError(err.message || 'An unexpected error occurred while loading.');
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId, token]); 
const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prevData => ({
        ...prevData,
        [name]: value,
    }));
};

const handleStudentSelect = (e) => {
    // Capture the ID of the selected student
    setSelectedStudentId(e.target.value);
};

const handleAddStudent = () => {
    if (!selectedStudentId || courseData.enrolledStudents.includes(selectedStudentId)) {
        // Do nothing if no student is selected or if they are already enrolled
        return;
    }

    setCourseData(prevData => ({
        ...prevData,
        // Add the new student ID to the array
        enrolledStudents: [...prevData.enrolledStudents, selectedStudentId],
    }));

    // Reset the dropdown selection after adding
    setSelectedStudentId('');
};

const handleRemoveStudent = (studentIdToRemove) => {
    // Update the courseData by removing the specified ID from the enrolledStudents array
    setCourseData(prevData => ({
        ...prevData,
        // Use filter() to create a new array excluding the studentIdToRemove
        enrolledStudents: prevData.enrolledStudents.filter(
            id => id !== studentIdToRemove
        ),
    }));
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSubmitSuccess(false);

    try {
        const url = `${COURSE_API_BASE_URL}/${courseId}`;
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            // Send the updated courseData, including the enrolledStudents array
            body: JSON.stringify(courseData), 
        });
        
        if (res.status === 404) {
            throw new Error('Course not found during update.');
        }
        if (!res.ok) {
            const errorBody = await res.json().catch(() => ({}));
            const errorMessage = errorBody.err || 'Failed to update course.';
            throw new Error(errorMessage);
        }

        setSubmitSuccess(true);

        setTimeout(() => {
            navigate(`/courses/${courseId}`); 
        }, 1500);

    } catch (err) {
        console.error('Update Error:', err);
        setError(err.message || 'An unexpected error occurred during update.');
    } finally {
        setIsSubmitting(false);
    }
};
    
    if (loading) {
        return <div >Loading course details...</div>;
    }

    if (error && !courseData.title) { 
        return <div>Error: {error}</div>;
    }

return (
    <div>
        <h2>Edit Course: {courseData.title}</h2>
        
        {submitSuccess && (
            <div>Course updated successfully! Redirecting...</div>
        )}

        <form onSubmit={handleSubmit}>
            {/* --- Course Title and Description --- */}
            <div>
                <label>Course Title</label>
                <input
                    type="text"
                    name="title"
                    value={courseData.title || ''}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label>Description</label>
                <textarea
                    name="description"
                    value={courseData.description || ''}
                    onChange={handleChange}
                    required
                />
            </div>
            
            {/* --- 🔑 UPDATED ENROLLMENT INTERFACE (Add One-by-One) --- */}
            <div style={{ border: '1px solid #ccc', padding: '15px', marginTop: '20px' }}>
                <h3>Enrollment Management</h3>

                {/* 1. Add Student Controls (Dropdown + Button) */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '15px' }}>
                    <div>
                        <label htmlFor="student-select">Select Student to Enroll:</label>
                        <select
                            id="student-select"
                            value={selectedStudentId} // Binds to the temporary selection state
                            onChange={handleStudentSelect}
                        >
                            <option value="" disabled>-- Choose a Student --</option>
                            {availableStudents
                                // Filter out students who are already enrolled for a cleaner dropdown
                                .filter(student => !courseData.enrolledStudents.includes(student._id.toString()))
                                .map(student => (
                                    <option key={student._id} value={student._id}>
                                        {student.username}
                                    </option>
                                ))}
                        </select>
                    </div>
                    
                    <button 
                        type="button" // Important: prevents the button from submitting the main form
                        onClick={handleAddStudent}
                        disabled={!selectedStudentId} // Disabled if nothing valid is selected
                    >
                        Add Student
                    </button>
                </div>

                {/* 2. Display Currently Enrolled Students */}
                <h4>Current Enrollment List:</h4>
                {courseData.enrolledStudents.length === 0 ? (
                    <p>No students enrolled yet. Add students above and click 'Save Changes'.</p>
                ) : (
                    <ul>
                        {courseData.enrolledStudents.map(enrolledId => {
                            // Find the full student object by ID to display the username
                            const student = availableStudents.find(s => s._id.toString() === enrolledId.toString());
                            
                            return student ? (
                                <li key={enrolledId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                   <span>{student.username}</span>
                                    <button 
                                      type="button" 
                                      onClick={() => handleRemoveStudent(enrolledId)} // Pass the ID to the handler
                                      style={{ marginLeft: '10px', padding: '2px 8px', cursor: 'pointer' }}
                                    >
                                      Remove
                                    </button>
                                  </li>
                                ) : (
                                  <li key={enrolledId}>Unknown Student (ID: {enrolledId})</li>
                                );
                              })}
                            </ul>
                )}
            </div>
            {/* --- END UPDATED ENROLLMENT INTERFACE --- */}
            
            <button type="submit" disabled={isSubmitting || loading} style={{ marginTop: '20px' }}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
        </form>
        
        {error && <div style={{color: 'red', marginTop: '10px'}}>{error}</div>}
    </div>
);
}
export default CourseEdit;