import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Header from './Header'
import Login from './login';
import Register from './register';
import TaskDashboard from './Taskdashboard';
import TaskInsightDashboard from './TaskInsightDashboard';



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check if the user is already authenticated (for example, by checking localStorage)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token) => {
    // Simulate successful login, store token
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    navigate('/task_insights'); // Redirect to the dashboard
  };

  const handleLogout = () => {
    // Clear token and set the user to logged out
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/'); // Redirect to the login page
  };
  return (
    <>
       {isAuthenticated && <Header onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />}/>
        <Route path="/register" element={<Register />} />
        <Route path="/task_dashboard" element={isAuthenticated ? <TaskDashboard /> : <Login onLogin={handleLogin} />} />
        <Route path="/task_insights" element={isAuthenticated ? <TaskInsightDashboard /> : <Login onLogin={handleLogin} />} />
      </Routes>
    </>
  );
}

export default App;
