import React from 'react'
import LoginForm from './Components/LoginForm'
import axios from 'axios'
import { Routes, Route} from 'react-router-dom'
import SignupForm from './Components/SignupForm'
import Dashboard from './Components/Dashboard'
import { Toaster } from 'react-hot-toast'

axios.defaults.baseURL = 'http://localhost:5000'
axios.defaults.withCredentials = true

function App() {
  return (
    <Router>
    <>  
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: '',
          duration: 5000,
          removeDelay: 1000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  </Router>
  )
} 

export default App