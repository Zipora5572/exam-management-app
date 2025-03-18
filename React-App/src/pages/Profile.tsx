import { useState } from 'react';
import { Box, TextField, Button, Grid, Paper, Typography } from '@mui/material';
import { UserType } from '../models/User';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, StoreType } from '../store/store';
import { updateUser } from '../store/userSlice';

const Profile = () => {

    const user = useSelector((state: StoreType) => state.auth.user)
    const dispatch = useDispatch<AppDispatch>();
    const [formData, setFormData] = useState<Partial<UserType>>({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        address: user?.address,
        phoneNumber: user?.phoneNumber,
        password: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData({
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
            address: user?.address,
            phoneNumber: user?.phoneNumber,
            password: ''
        });
        setIsEditing(false);
    };

    const handleSave = () => {
        // userDispatch({ type: 'UPDATE', data: { ...formData } });
        dispatch(updateUser({ id: user?.id as number, data: { ...formData } }));
        setIsEditing(false);
    };

    return (
        <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            height="100vh"
            paddingLeft={2}
            marginLeft={30}
        >
            <Box display="flex" flexDirection="column" alignItems="flex-start">
                <Typography
                    variant="h5"
                    style={{
                        marginBottom: '20px',
                        fontWeight: 'bold',
                        textAlign: 'left'
                    }}
                >
                    ACCOUNT PROFILE
                </Typography>
                <Box display="flex" justifyContent="flex-end" width="100%" marginBottom="20px"> {/* מיקום הכפתור */}
                    <Button
                        variant="text"
                        onClick={handleEdit}
                    >
                        Edit
                    </Button>
                </Box>
                <Paper
                    elevation={0}
                    style={{ padding: '20px', border: '1px solid lightgray', width: '75%', borderRadius: '0' }} // מסגרת מרובעת
                >
                    <Grid container spacing={2}>
                        <Grid item xs={6} style={{ paddingLeft: '20px' }}>
                            <Typography variant="h6" style={{ textAlign: 'left' }}>First Name</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                value={formData.firstName}
                                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                InputProps={{
                                    style: { backgroundColor: '#f0f0f0', borderRadius: '0' }, // הסרת רדיוס
                                    readOnly: !isEditing,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} style={{ paddingLeft: '20px' }}>
                            <Typography variant="h6" style={{ textAlign: 'left' }}>Last Name</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                value={formData.lastName}
                                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                InputProps={{
                                    style: { backgroundColor: '#f0f0f0', borderRadius: '0' }, // הסרת רדיוס
                                    readOnly: !isEditing,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} style={{ paddingLeft: '20px' }}>
                            <Typography variant="h6" style={{ textAlign: 'left' }}>Email</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                InputProps={{
                                    style: { backgroundColor: '#f0f0f0', borderRadius: '0' }, // הסרת רדיוס
                                    readOnly: !isEditing,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} style={{ paddingLeft: '20px' }}>
                            <Typography variant="h6" style={{ textAlign: 'left' }}>Address</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                value={formData.address}
                                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                InputProps={{
                                    style: { backgroundColor: '#f0f0f0', borderRadius: '0' }, // הסרת רדיוס
                                    readOnly: !isEditing,
                                }}
                            />
                        </Grid>

                        <Grid item xs={6} style={{ paddingLeft: '20px' }}>
                            <Typography variant="h6" style={{ textAlign: 'left' }}>Phone Number</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                InputProps={{
                                    style: { backgroundColor: '#f0f0f0', borderRadius: '0' }, // הסרת רדיוס
                                    readOnly: !isEditing,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} style={{ paddingLeft: '20px' }}>
                            <Typography variant="h6" style={{ textAlign: 'left' }}>Password</Typography>
                        </Grid>
                            <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                InputProps={{
                                    style: { backgroundColor: '#f0f0f0', borderRadius: '0' }, // הסרת רדיוס
                                    readOnly: !isEditing,
                                }}
                                required
                            />
                    </Grid>
                  
                </Grid>
                {isEditing && (
                    <Box display="flex" flexDirection="column" alignItems="flex-end" marginTop={2}>
                        <Box display="flex" justifyContent="flex-end" width="100%">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                                style={{ width: '75%', marginBottom: '10px' }} // כפתור רחב
                            >
                                SAVE DETAILS
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                )}
            </Paper>
        </Box>
        </Box >
    );
}

export default Profile;
