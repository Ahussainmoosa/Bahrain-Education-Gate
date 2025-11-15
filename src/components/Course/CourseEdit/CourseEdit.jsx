import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

// IMPORTANT: Set your backend base URL and port
const API_BASE_URL = 'http://localhost:3000/courses';

function CourseEdit() {
    const { courseId } = useParams(); 
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        enrolledStudents:'',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!token) {
                setError("Authentication token is missing.");
                setLoading(false);
                return;
            }
            try {
                const url = `${API_BASE_URL}/${courseId}/edit`;
                const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (res.status === 404) {
                    throw new Error('Course not found.');
                }
                if (!res.ok) {
                    throw new Error('Failed to load course details.');
                }

                const data = await res.json();
                setCourseData(data);
                setLoading(false);
            } catch (err) {
                console.error('Fetch Error:', err);
                setError(err.message || 'An unexpected error occurred while loading.');
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId, token]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSubmitSuccess(false);

        try {
            const url = `${API_BASE_URL}/${courseId}`;
            const res = await fetch(url, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
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
                <div>
                    <label>Course Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={courseData.title || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={courseData.description || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <button type="submit" disabled={isSubmitting || loading}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}

export default CourseEdit;

