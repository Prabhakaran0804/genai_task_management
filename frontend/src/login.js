import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Grid2, Container, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import API_BASE_URL from './config';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const navigate = useNavigate();

  const handleLogin = () => {
    // Handle login logic here

    const API_URL = `${API_BASE_URL}/token`;

    if (email === "" || password === ""){
      alert('Please provide valid credential')
      return
    }
    
    axios.post(API_URL, { email:email,password:password })
  .then(response => {
    // Handle success (status 2xx)
    console.log(response.data);
    onLogin(response.data.access_token)
  })
  .catch(error => {
    // Handle error (status code not in the 2xx range)
    if (error.response) {
      // Server responded with a status outside the 2xx range
      alert('Invalid credential')
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
          Login
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{ mt: 1 }}
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: 'primary.main' }}
          >
            Login
          </Button>
          <Grid2 container>
            <Grid2 item>
              <Link to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid2>
          </Grid2>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
