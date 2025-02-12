import React, { useState } from 'react';
import { TextField, Button, Container, Grid2, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from './config';



const Register = () => {
  const API_URL = `${API_BASE_URL}/register`;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    // Handle register logic here

    if (email === "" || password === ""){
      alert('Please provide valid credential')
      return
    }

    if (password !== confirmPassword){
      alert('Please check you password. both are not same')
      return
    }

    axios.post(API_URL, { email:email,password:password })
  .then(response => {
    // Handle success (status 2xx)
    navigate('/')
  })
  .catch(error => {
    // Handle error (status code not in the 2xx range)
    if (error.response) {
      // Server responded with a status outside the 2xx range
      alert('Error while register new user')
      console.error(`Error: ${error.response.status} - ${error.response.data.message}`);
    } else {
      // No response was received
      console.error('Error: No response from server');
    }
  });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 8,
        }}
      >
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{ mt: 1 }}
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid2 container>
            <Grid2 item>
              <Link to="/" variant="body2">
                {"Already have an account? Sign In"}
              </Link>
            </Grid2>
          </Grid2>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
