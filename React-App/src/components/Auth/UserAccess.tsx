import { useContext, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import AuthForm from "./AuthForm";
import { initialUserState, UserContext } from "../../contexts/UserReducer";
import UserProfile from "../UserProfile";
import { useSelector } from "react-redux";
import { StoreType } from "../../store/store";


const UserAccess = () => {
  const user = useSelector((state: StoreType) => state.auth.user)

    // const { user, userDispatch } = useContext(UserContext);
    const token = localStorage.getItem('token');
    // const [isLoggedIn, setIsLoggedIn] = useState(token !== null);
    console.log(user);
    
    const navigate = useNavigate();

    const handleOpen = () => {
         navigate('/authForm');
    };

    const handleClose = () => {
      
        navigate('/home');
    };
    return (
        <>
            {user==null ? (
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
