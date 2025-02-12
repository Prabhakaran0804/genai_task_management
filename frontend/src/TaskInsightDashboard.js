import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "./config";
import { Box, Typography, Paper, Grid2, Card, CardContent, CardHeader } from '@mui/material';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Registering the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const TaskInsightDashboard = () => {
  // Sample task data
  const [tasks, setTasks] = useState([]);
  const [priority, setPriority] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = `${API_BASE_URL}/tasks`;
  const PRIORITY_API_URL = `${API_BASE_URL}/insights`;
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  // Fetch tasks from API
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      setError("Error fetching tasks");
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };
  //Fetch Priority
  const fetchPriority = async () => {
    setLoading(true);
    try {
      const response = await axios.get(PRIORITY_API_URL);
      setPriority(response.data);
    } catch (error) {
      setError("Error fetching tasks");
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriority();
  }, []);
  useEffect(() => {
    fetchTasks();
  }, []);

  // Get the total number of tasks
  const totalTasks = tasks.length;

  // Task count by status
  const taskStatusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  // Task count by priority
  const taskPriorityCounts = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {});

  // Task sentiment count by priority
  const taskSentimentCounts = priority.reduce((acc, task) => {
    acc[task.sentiment] = (acc[task.sentiment] || 0) + 1;
    return acc;
  }, {});

  // Chart.js Data for Status Distribution
  const statusChartData = {
    labels: Object.keys(taskStatusCounts),
    datasets: [{
      label: 'Tasks by Status',
      data: Object.values(taskStatusCounts),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    }],
  };

  // Chart.js Data for Priority Distribution
  const priorityChartData = {
    labels: Object.keys(taskPriorityCounts),
    datasets: [{
      label: 'Tasks by Priority',
      data: Object.values(taskPriorityCounts),
      backgroundColor: ['#FFCE56', '#33FF57', '#3357FF'],
    }],
  };

  // Chart.js Data for sentiment Distribution
  const taskSentimentChartData = {
    labels: Object.keys(taskSentimentCounts),
    datasets: [{
      label: 'Tasks by Priority',
      data: Object.values(taskSentimentCounts),
      backgroundColor: ['#FF5733', '#33FF57', '#3357FF'],
    }],
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>Task Insight Dashboard</Typography>

      <Grid2 container spacing={3}>
        {/* Total Tasks Card */}
        <Grid2 item xs={12} sm={4}>
          <Card>
            <CardHeader title="Total Tasks" />
            <CardContent>
              <Typography variant="h5">{totalTasks}</Typography>
            </CardContent>
          </Card>
        </Grid2>

        {/* Tasks by Priority */}
        <Grid2 item xs={12} sm={4}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>Tasks by Priority</Typography>
            <Doughnut data={priorityChartData} />
          </Paper>
        </Grid2>

        {/* Tasks by Priority */}
        <Grid2 item xs={12} sm={4}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>Tasks sentiments by desc</Typography>
            <Doughnut data={taskSentimentChartData} />
          </Paper>
        </Grid2>

        {/* Bar Chart for Task Status */}
        <Grid2 item xs={12}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>Task Status Distribution</Typography>
            <Bar data={statusChartData} />
          </Paper>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default TaskInsightDashboard;
