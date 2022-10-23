import { AppBar, Toolbar, Typography, Avatar, Tooltip, 
  Button, Box, Container, CssBaseline, IconButton } from '@mui/material';
import React from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard'

const Header = ({ component = null }) => {
  const newTab = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("dashboard.html") });
  }
  const leftSide = <Box sx={{ flexGrow: 0, display: 'flex', flexDirection: 'row' }}>
    <Avatar sx={{ ml: 2 }} alt="Logo" src='hackgt9.png'/>
  <Typography
    variant="h6"
    noWrap
    sx={{
      ml: 1,
      mt: 0.5,
      mr: 2,
      fontWeight: 700,
      letterSpacing: '.1rem',
      color: 'inherit',
      textDecoration: 'none',
    }}
  >
    DataDefender
  </Typography>
    </Box>

  return (<AppBar position="static" sx={{ bgcolor: '#8a8894' }}>
  <Toolbar disableGutters>
    {component || leftSide}
    <Box sx={{ flexGrow: 1 }} />
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Dashboard">
        <IconButton onClick={newTab} sx={{ p: 0, mr: 2 }}>
          <DashboardIcon style={{ color: "white" }} />
        </IconButton>
      </Tooltip>
    </Box>
  </Toolbar>
  </AppBar>)
}

export default Header