import { Menu, MenuItem, ListItemIcon, Divider, Typography, Avatar } from '@mui/material';
import { Settings, Logout } from '@mui/icons-material';

interface UserMenuProps {
    anchorEl: null | HTMLElement;
    open: boolean;
    handleClose: () => void;
    handleEdit: () => void;
    handleLogout: () => void;
    username: string; 
    email: string; 
}

const UserMenu = ({ anchorEl, open, handleClose, handleEdit, handleLogout, username, email }: UserMenuProps) => {
    return (
        <>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
               
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
                    <Avatar
                        sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            width: 45,
                            height: 45,
                            marginRight: 8, // הוספת מרווח בין ה-Avatar לטקסט
                            marginLeft: 3,
                            marginBottom:1 // הוספת מרווח בין ה-Avatar לטקסט
                        }}
                    >
                        {username.charAt(0).toUpperCase()}
                    </Avatar>
                    <div style={{marginRight:'30px'}}> {/* הוספת מרווח נוסף */}
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{username}</Typography>
                        <Typography variant="body2" color="textSecondary">{email}</Typography>
                    </div>
                </div>
                <Divider />
                <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Edit Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Sign out
                </MenuItem>
            </Menu>
        </>
    );
};

export default UserMenu;
