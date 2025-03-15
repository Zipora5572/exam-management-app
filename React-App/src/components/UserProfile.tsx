import { Box, IconButton, Tooltip, Avatar } from '@mui/material';
import React, {  useState } from 'react';
// import { UserContext } from '../../contexts/UserReducer';
// import UserMenu from '../UserMenu';
import { useNavigate } from "react-router-dom";
import authService from "../services/AuthService";
import UserMenu from './UserMenu';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, StoreType } from '../store/store';
import { logout } from '../store/userSlice';
const UserProfile = () => {
    // const { user, userDispatch } = useContext(UserContext);
  const user = useSelector((state: StoreType) => state.auth.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  
  
const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authService.logout();
    dispatch(logout());
    //  userDispatch({ type: 'LOG_OUT' });
  };

  const handleEdit = () => {
   navigate('/profile')
  };

  return (
    <>
      <Box>
        <Tooltip title={`Hello ${user?.firstName ? user.firstName: "guest"}` }>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ 
              p: 0, 
              '&:hover': {
                backgroundColor: 'rgba(255, 87, 34, 0.1)', 
              }
            }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar 
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'white', 
                width: 40, 
                height: 40, 
              }}
            >
      {user?.firstName ? user.firstName.charAt(0).toUpperCase() : "?"}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>

      <UserMenu
        anchorEl={anchorEl}
        open={open}
        handleClose={handleClose}
        handleEdit={handleEdit}
        handleLogout={handleLogout}
        username={user?.firstName}
        email={user?.email}
      />

      {/* <EditProfile open={isOpen} handleClose={closeModal} /> */}
    </>
  );
};

export default UserProfile;
