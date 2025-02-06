import React from 'react'
import { Form, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom'
import '../css/SignupForm.css'
import axios from 'axios'
import { toast } from 'react-hot-toast'

function SignupForm() {
  const navigate = useNavigate()

  const [data, setData] = React.useState({
    age: '',
    year: '',
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const signupUser = async (e) => {
    e.preventDefault()
    const { age, year, name, username, email, password } = data
    try {
      const {data} = await axios.post('http://localhost:5000/signup',
      { age, year, name, username, email, password }
      )
      // check if user is created successfully
      if(data.error) {
        toast.error(data.error)
      } else {
        setData({});
        toast.success(data.message)
        navigate('/login')
      }
    } catch (error) {
      
    }
  }

  return (
    <>
    <div className="signup-container ">
      <div className="signup-card signup-width">
        <h1>Sign in</h1>
        <Form>
          <Form.Group className="input d-flex mb-2">
            <Form.Control
              type="number"
              placeholder="Age"
              className="login-input input-height"
              value={data.age}
              onChange={(e) => setData({ ...data, age: e.target.value })}
            />
            <Form.Control
              type="text"
              placeholder="Year-Section"
              className="login-input input-height"
              value={data.year}
              onChange={(e) => setData({ ...data, year: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-2 ">
            <Form.Control
              type="text"
              placeholder="Name"
              className="login-input input-height"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-2 ">
            <Form.Control
              type="text"
              placeholder="Username"
              className="login-input input-height"
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
            />
          </Form.Group>

          
          <Form.Group className="mb-2 ">
            <Form.Control
              type="email"
              placeholder="Email"
              className="login-input input-height"
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
            />
          </Form.Group>
          

          <Form.Group className="mb-2 ">
            <Form.Control
              type="password"
              placeholder="Password"
              className="login-input input-height"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-2 ">
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              className="login-input input-height"
              value={data.confirmPassword}
              onChange={(e) =>
                setData({ ...data, confirmPassword: e.target.value })
              }
            />
          </Form.Group>

          <Button
            className="button-login"
            onClick={() => navigate("#")}
          >
            Submit
          </Button>
        </Form>

        <div className="sign-up">
          <p className="text-center text-light">
            Already have an account?{" "}
            <a href="/login " className="">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  </>
  )
}

export default SignupForm