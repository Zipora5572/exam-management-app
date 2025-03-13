import { RouterProvider } from 'react-router-dom'
import './App.css'
import { router } from './AppRoutes'

import { useReducer } from 'react'
import UserReducer, { initialUserState, UserContext } from './contexts/UserReducer';

function App() {
const [user, userDispatch] = useReducer(UserReducer, initialUserState);

return (
<>
{/* <FileUpload/> */}

  {/* <AuthForm/> */}
  <UserContext value={{ user, userDispatch }}>
      <RouterProvider router={router} />
  </UserContext>
</>
)
}

export default App