import  { FormEvent, useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
// import  login  from "../../store/authSlice";
import { UserType } from '../../models/User';

import { useDispatch } from 'react-redux';

import { AppDispatch } from '../../store/store';
import { login, register } from '../../store/userSlice';
function AuthForm() {
    // const { user, userDispatch } = useContext(UserContext);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>, data: Partial<UserType>) => {
        e.preventDefault();
        let result
        if (!isLogin) {
            // result = await authService.register(data);        
            // if (result)
            //     userDispatch({ type: 'REGISTER', data: { ...data, id: result.user.id } });
            dispatch(register(data));
        }
        else {
            // result = await authService.login(data);
         
            // if (result)
            //     userDispatch({ type: 'LOGIN', data: result.user });
            dispatch(login(data));           
        }
        navigate('/home');
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4">{isLogin ? 'Sign in' : 'Sign Up'}</Typography>
            <form onSubmit={(e) => handleSubmit(e, { email, password })}>
                <TextField
                    label="email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
