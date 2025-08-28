import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  List as ListIcon,
  Psychology as PsychologyIcon,
  AccountBalance as AccountBalanceIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    handleUserMenuClose();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Mobile Drawer
  const drawer = (
    <Box>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
          My eXpenses
        </Typography>
      </Box>
      <Divider />
      <List sx={{ pt: 1 }}>
        {isAuthenticated ? (
          <>
            <ListItem
              button
              onClick={() => handleNavigation('/')}
              selected={isActive('/')}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  }
                }
              }}
            >
              <ListItemIcon>
                <HomeIcon color={isActive('/') ? 'inherit' : 'action'} />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>

            <ListItem
              button
              onClick={() => handleNavigation('/expenses')}
              selected={isActive('/expenses')}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  }
                }
              }}
            >
              <ListItemIcon>
                <ListIcon color={isActive('/expenses') ? 'inherit' : 'action'} />
              </ListItemIcon>
              <ListItemText primary="Expenses List" />
            </ListItem>

            <ListItem
              button
              onClick={() => handleNavigation('/investments')}
              selected={isActive('/investments')}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  }
                }
              }}
            >
              <ListItemIcon>
                <AccountBalanceIcon color={isActive('/investments') ? 'inherit' : 'action'} />
              </ListItemIcon>
              <ListItemText primary="Investments" />
            </ListItem>

            <ListItem
              button
              onClick={() => handleNavigation('/ai')}
              selected={isActive('/ai')}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  }
                }
              }}
            >
              <ListItemIcon>
                <PsychologyIcon color={isActive('/ai') ? 'inherit' : 'action'} />
              </ListItemIcon>
              <ListItemText primary="AI Forecasting" />
            </ListItem>

            <Divider sx={{ my: 1 }} />

            <ListItem
              button
              onClick={() => handleNavigation('/profile')}
              selected={isActive('/profile')}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  }
                }
              }}
            >
              <ListItemIcon>
                <AccountCircleIcon color={isActive('/profile') ? 'inherit' : 'action'} />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>

            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon color="action" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button onClick={() => handleNavigation('/login')}>
              <ListItemIcon>
                <AccountCircleIcon color="action" />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/register')}>
              <ListItemIcon>
                <AccountCircleIcon color="action" />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  // Desktop Navigation
  const DesktopNavigation = () => (
    <>
      <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
        <Button
          color="inherit"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          sx={{
            backgroundColor: isActive('/') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }
          }}
        >
          Home
        </Button>
        <Button
          color="inherit"
          startIcon={<ListIcon />}
          onClick={() => navigate('/expenses')}
          sx={{
            backgroundColor: isActive('/expenses') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }
          }}
        >
          Expenses List
        </Button>
        <Button
          color="inherit"
          startIcon={<AccountBalanceIcon />}
          onClick={() => navigate('/investments')}
          sx={{
            backgroundColor: isActive('/investments') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }
          }}
        >
          Investments
        </Button>
        <Button
          color="inherit"
          startIcon={<PsychologyIcon />}
          onClick={() => navigate('/ai')}
          sx={{
            backgroundColor: isActive('/ai') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }
          }}
        >
          AI Forecasting
        </Button>
      </Box>

      {isAuthenticated && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'inherit' }}>
            {user?.username || 'User'}
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleUserMenuOpen}
            sx={{ p: 0.5 }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => { handleUserMenuClose(); navigate('/profile'); }}>
              <AccountCircleIcon sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      )}
    </>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            My eXpenses
          </Typography>

          {isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isAuthenticated && (
                <IconButton
                  color="inherit"
                  onClick={handleUserMenuOpen}
                  sx={{ p: 0.5 }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                    <AccountCircleIcon />
                  </Avatar>
                </IconButton>
              )}
              {!isAuthenticated && (
                <Button color="inherit" onClick={() => navigate('/login')}>
                  Login
                </Button>
              )}
            </Box>
          ) : (
            <DesktopNavigation />
          )}
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: 240 }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
}

export default Navigation;
