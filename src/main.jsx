import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router';
import './index.css'
import App from './App.jsx'
import { UserProvider } from './contexts/UserContext.jsx'
import { AssignmentsProvider } from './contexts/AssignmentContext.jsx';

// Wrap the App component with the BrowserRouter component to enable
// enable route handling throughout your application.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <UserProvider>
          <AssignmentsProvider>
            <App />
          </AssignmentsProvider>
        </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
