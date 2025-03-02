import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "../../css/LoginForm.css";
import axios from "axios";
import toast from "react-hot-toast";

function LoginForm() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const loginUser = async (e) => {
      e.preventDefault();
      
      try {
        const response = await axios.post("http://localhost:5000/api/login", {
          email: data.email,
          password: data.password,
        });
    
        console.log("Login response:", response.data); // Debugging
    
        if (response.status === 200 && response.data.status === "ok") {
          toast.success("Login successful!");
          
          localStorage.setItem("token", response.data.data);
          localStorage.setItem("loggedIn", "true");
    
          console.log("✅ Token stored:", localStorage.getItem("token"));
    
          // ✅ Use React Router's navigate instead of full page reload
          navigate("/dashboard", { replace: true });
        } else {
          toast.error(response.data.message || "Login failed");
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error(error.response?.data?.message || "Login failed");
      }
    };
    
    // ✅ Run only once on mount to check token
    useEffect(() => {
      if (localStorage.getItem("token")) {
        console.log("✅ Token exists, redirecting to /dashboard...");
        navigate("/dashboard", { replace: true });
      }
    }, []); // ✅ Empty dependency array ensures it runs only once
    

  return (
    <div className="login-container">
      <div className="login-card login-width">
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
            <Form.Check type="checkbox" label="Remember me" className="check-box text-light" />
            <a href="#" className="forgot-password">
              Forgot Password?
            </a>
          </div>

          <Button type="submit" className="button-login">
            Login
          </Button>
        </Form>

        <div className="sign-up">
          <p className="text-center text-light">
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
