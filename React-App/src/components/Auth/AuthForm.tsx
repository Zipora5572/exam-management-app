import  { FormEvent, useContext, useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import authService from "../../services/AuthService";
import { useNavigate } from "react-router-dom";

import { UserType } from '../../models/User';
import { UserContext } from '../../contexts/UserReducer';
function AuthForm() {
    const { user, userDispatch } = useContext(UserContext);
    const [isLogin, setIsLogin] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>, data: Partial<UserType>) => {
        e.preventDefault();
        let result
        if (!isLogin) {
            result = await authService.register(data);
            
            
            if (result)
                userDispatch({ type: 'REGISTER', data: { ...data, id: result.user.id } });
        }
        else {
            result = await authService.login(data);
         
            if (result)
                userDispatch({ type: 'LOGIN', data: result.user });
            
        }
        navigate('/home');
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4">{isLogin ? 'Sign in' : 'Sign Up'}</Typography>
            <form onSubmit={(e) => handleSubmit(e, { firstName, password })}>
                <TextField
                    label="username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    {isLogin ? 'Login' : 'Sign Up'}
                </Button>
                <Button
                    onClick={() => setIsLogin(!isLogin)}
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    style={{ marginTop: '10px' }}
                >
                    Switch to {isLogin ? 'Sign Up' : 'Login'}
                </Button>
            </form>
        </Container>
    );
}

export default AuthForm;
