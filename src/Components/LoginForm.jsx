import React from "react";
import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "../css/LoginForm.css";
import axios from "axios";
import toast from "react-hot-toast"; // Import toast from react-hot-toast

function LoginForm() {
  const navigate = useNavigate();

  const [data, setData] = React.useState({
    email: "",
    password: "",
  });

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", data);
      if (response.status === 200) {
        toast.success("Login successful!");
        navigate("/Dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <div className="login-container ">
        <div className="login-card login-width ">
          <h1>LOGIN</h1>
          <Form onSubmit={loginUser}>
            <Form.Group className="mb-2">
              <Form.Control
                type="email"
                placeholder="Email"
                className="login-input input-height"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Control
                type="password"
                placeholder="Password"
                className="login-input input-height"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
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

            <Button type="submit" className="button-login">
              Submit
            </Button>
          </Form>

          <div className="sign-up">
            <p className="text-center text-light">
              Don't have an account?{" "}
              <a href="/signup " className="">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
