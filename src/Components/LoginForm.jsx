import React from 'react'
import { Form, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom'
import '../css/LoginForm.css'

function LoginForm() {

  const navigate = useNavigate()

  return (
   <>
      <div className="login-container ">
        <div className="login-card login-width ">
          <h1>LOGIN</h1>
          <Form>
            <Form.Group className="mb-2">
              <Form.Control
                type="email"
                placeholder="Email"
                className="login-input input-height"
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Control
                type="password"
                placeholder="Password"
                className="login-input input-height"
              />
            </Form.Group>

            <div className="d-flex justify-content-between align-items-top mb-3">
              <Form.Check
                type="checkbox"
                label="Remember me"
                className="check-box text-light"
              />
              <a href="#" className="forgot-password ">
                Forgot Password?
              </a>
            </div>

            <Button className="button-login" onClick={() => navigate("#")}>
              Submit
            </Button>
          </Form>

          <div className="sign-up">
            <p className="text-center text-light">
              Don't have an account? {" "}
              <a href="/signup " className="">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginForm