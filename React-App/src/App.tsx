import React from "react"
import { RouterProvider } from "react-router-dom"
import { Provider } from "react-redux"
import store from "./store/store"
import { router } from "./AppRoutes"
import Example from "./components/example"

function App() {
  

  return (
    <>
     <Provider store={store}>
     
        <RouterProvider router={router} />
      
      </Provider>
    {/* <Example/> */}
    </>
  )
}

export default App
