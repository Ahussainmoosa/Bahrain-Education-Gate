import { createContext, useState, useEffect, useContext } from 'react';
import { assignmentService } from '../services/assignmentService';
import { UserContext } from './UserContext';

export const AssignmentsContext = createContext();

export const AssignmentsProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [assignments, setAssignments] = useState([]);

  // Fetch assignments when user logs in
  useEffect(() => {
    const fetchAssignments = async () => {
      if (!user) return;
      try {
        const data = await assignmentService.getAllAssignments();
        setAssignments(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAssignments();
  }, [user]);

  const addAssignment = (newAssignment) => {
    setAssignments((prev) => [...prev, newAssignment]);
  };

  return (
    <AssignmentsContext.Provider value={{ assignments, setAssignments, addAssignment }}>
      {children}
    </AssignmentsContext.Provider>
  );
};
