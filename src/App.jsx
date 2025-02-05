import React from 'react'
import LoginForm from './Components/LoginForm'
import axios from 'axios'
import { Routes, Route} from 'react-router-dom'
import SignupForm from './Components/SignupForm'
import Dashboard from './Components/Dashboard'

axios.defaults.baseURL = 'http://localhost:5000'
axios.defaults.withCredentials = true

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
} 

export default App