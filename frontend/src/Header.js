import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Avatar, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const Header = ({ onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState({
    name: 'John Doe',
    profilePic: 'https://via.placeholder.com/40', // Replace with the actual user profile pic URL
  });

  // Handle the opening and closing of the user menu
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  /*
  const handleLogout = () => {
    localStorage.removeItem('token'); // Example: clearing a stored token
    window.location.href = '/'; // Redirect to login page
  };
  */

  return (
    <AppBar position="sticky">
      <Toolbar>
        {/* Menu Icon (Hamburger) for mobile view */}
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

        {/* Logo or App Name */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MyApp
        </Typography>

        {/* Menu Bar with links */}
        <Button color="inherit">
          <Link to="/task_dashboard" style={{ color: 'white', textDecoration: 'none' }}>
            Task Board
          </Link>
        </Button>
        <Button color="inherit">
          <Link to="/task_insights" style={{ color: 'white', textDecoration: 'none' }}>
            Task Insights
          </Link>
        </Button>

        {/* User Profile Section */}
        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
        >
          <Avatar alt={user.name} src={user.profilePic} />
        </IconButton>

        {/* User Profile Menu */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
        >
          <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>Settings</MenuItem>
          <MenuItem onClick={onLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
