// src/App.jsx

import { Routes, Route } from 'react-router'; // Import React Router

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import Course from './components/Course/Course';
import { useContext } from 'react';
import { UserContext } from './contexts/UserContext';
import CourseDetails from './components/Course/CourseDetails/CourseDetails';
import CourseEdit from './components/Course/CourseEdit/CourseEdit';
import AssignmentList from './components/AssignmentList/AssignmentList';
import AssignmentForm from './components/AssignmentForm/AssignmentForm';
import AssignmentDetails from './components/AssignmentDetails/AssignmentDetails';
import AssignmentEdit from './components/AssignmentForm/AssignmentEdit';

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <NavBar />

      <Routes>
        {
          user ?
          <>
            <Route path='/courses' element={<Dashboard/>}/>
            <Route path='/courses/new' element={<Course />} />
            <Route path='/courses/:id' element={<CourseDetails />} />
            <Route path='/courses/:courseId/edit' element={<CourseEdit />}/>
            <Route path='/assignments' element={<AssignmentList/>}/>
            <Route path='/assignments/new' element={<AssignmentForm />} />
            <Route path='/assignments/:id' element={<AssignmentDetails />} />
            <Route path='/assignments/:id/edit' element={<AssignmentEdit />} />
          </>
            :
            <Route path='/' element={<Landing/>}/>
        }
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path='/sign-in' element={<SignInForm />} />
        
      </Routes>
    </>
  );
};

export default App;

