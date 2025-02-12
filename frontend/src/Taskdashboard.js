import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Modal,
  Box,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import API_BASE_URL from "./config";

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [taskData, setTaskData] = useState({ id: null, task: "", description: "", priority: "", status: "" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = `${API_BASE_URL}/tasks`;
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

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleModalOpen = (task = null) => {
    // Set taskData only when the modal is opened for editing a task.
    // For new task, set empty object
    setTaskData(task || { id: null, task: "", description: "", priority: "", status: "" });
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleSaveTask = async (formData) => {
    if (!formData.task || !formData.description || !formData.priority || !formData.status) {
      setError("All fields are required.");
      return;
    }

    setError(""); // Clear any previous error
    try {
      if (formData.id) {
        // Updating existing task
        await axios.put(`${API_URL}/${formData.id}`, formData);
        setTasks(tasks.map(t => (t.id === formData.id ? formData : t)));
      } else {
        // Creating a new task
        const response = await axios.post(API_URL, formData);
        setTasks([...tasks, response.data]);
      }
      handleModalClose();
    } catch (error) {
      setError("Error saving task");
      console.error("Error saving task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      setError("Error deleting task");
      console.error("Error deleting task:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleModalOpen()}>
        Add Task
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Task</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.task}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleModalOpen(task)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteTask(task.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={tasks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <TaskModal open={openModal} task={taskData} onClose={handleModalClose} onSave={handleSaveTask} />
      {loading && <Typography>Loading...</Typography>}
    </Container>
  );
};

const TaskModal = ({ open, task, onClose, onSave }) => {
  const [formData, setFormData] = useState(task);

  useEffect(() => {
    setFormData(task); // Sync task with formData when task changes
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Send formData to the parent component
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ padding: 4, margin: "auto", maxWidth: 400, backgroundColor: "white", borderRadius: 2 }}>
        <Typography variant="h6">{formData.id ? "Edit Task" : "Add Task"}</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Task"
            fullWidth
            name="task"
            value={formData.task}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Description"
            fullWidth
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Priority"
            fullWidth
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Status"
            fullWidth
            name="status"
            value={formData.status}
            onChange={handleChange}
            margin="normal"
          />
          <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
            Save
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default TaskDashboard;
