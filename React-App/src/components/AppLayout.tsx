import { Outlet } from "react-router"
import NavBar from "./NavBar"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, StoreType } from "../store/store";

import { initialUserState } from "../contexts/UserReducer";
import { checkAuth } from "../store/userSlice";

const AppLayout = () => {
const dispatch = useDispatch<AppDispatch>();
const  user  = useSelector((state: StoreType) => state.auth.user); 
useEffect(() => {
   if(user==null||user==initialUserState) 
      dispatch(checkAuth());
    
  }, [dispatch]);
    return (
    <>
       <NavBar/>
        <Outlet />
        {/* <Footer /> */}
    </>
    )
}

export default AppLayout