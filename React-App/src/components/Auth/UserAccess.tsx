import { useContext, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import AuthForm from "./AuthForm";
import { initialUserState, UserContext } from "../../contexts/UserReducer";
import UserProfile from "../UserProfile";


const UserAccess = () => {
    const { user, userDispatch } = useContext(UserContext);
    const token = localStorage.getItem('token');
    // const [isLoggedIn, setIsLoggedIn] = useState(token !== null);
    
    const navigate = useNavigate();

    const handleOpen = () => {
        navigate('/authForm');
    };

    const handleClose = () => {
      
        navigate('/home');
    };
    return (
        <>
            {user==initialUserState ? (
                <>
                    <Button 
                        style={{
                            backgroundColor: 'transparent',
                            color: 'black',
                            border: 'none',
                            padding: '0',
                            fontSize: 'normal',
                            fontWeight: '545', 
                            cursor: 'pointer',
                            textTransform: 'none',
                            outline: 'none',
                            boxShadow: 'none',
                        }}
                        onClick={handleOpen} 
                    >
                        Sign in
                    </Button>
                </>
            ) : (
            <UserProfile />
            )}
            
        </>
    );
};

export default UserAccess;
