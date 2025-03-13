import { Outlet } from "react-router"
import NavBar from "./NavBar"

const AppLayout = () => {
    return (
    <>
       <NavBar/>
        <Outlet />
        {/* <Footer /> */}
    </>
    )
}

export default AppLayout