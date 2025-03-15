import { RouterProvider } from 'react-router-dom'
import './App.css'
import { router } from './AppRoutes'

import { useEffect, useReducer } from 'react'
import UserReducer, { initialUserState, UserContext } from './contexts/UserReducer';
import { Provider, useDispatch } from 'react-redux';
import store, { AppDispatch } from './store/store';
import { checkAuth } from './store/userSlice';

function App() {
const [user, userDispatch] = useReducer(UserReducer, initialUserState);


return (
<>
{/* <FileUpload/> */}

  {/* <AuthForm/> */}
  
  <Provider store={store}>
        <UserContext value={{ user, userDispatch }}>
          <RouterProvider router={router} />
        </UserContext>
    </Provider>

</>
)
}

export default App