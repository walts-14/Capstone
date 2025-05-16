import React, { useState, useEffect, useContext } from "react";
import { ProgressContext } from "../Dashboard/ProgressContext.jsx";
import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "../../css/LoginForm.css";
import axios from "axios";
import toast from "react-hot-toast";

function LoginForm() {
  const navigate = useNavigate();
  const {
    setCurrentUserEmail,
    setCurrentUserName,
    setCurrentUserUsername,  // <-- add this
  } = useContext(ProgressContext);

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

      if (response.status === 200 && response.data.status === "ok") {
        toast.success("✅ Login successful!");

        // Store token and user data
        localStorage.setItem("token", response.data.data);
        localStorage.setItem("userName", response.data.user.name);
        localStorage.setItem("userUsername", response.data.user.username); // <-- store username
        localStorage.setItem("userEmail", response.data.user.email);
        localStorage.setItem("loggedIn", "true");

        // Update context
        setCurrentUserEmail(response.data.user.email);
        setCurrentUserName(response.data.user.name);
        console.log(setCurrentUserUsername(response.data.user.username));         // <-- update context

        // Role-based redirect
        const role = response.data.user.role;
        if (role === "super_admin") {
          navigate("/superadmin", { replace: true });
        } else if (role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } else {
        toast.error(response.data.message || "❌ Login failed");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      toast.error(error.response?.data?.message || "❌ Login failed");
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await axios.get("http://localhost:5000/api/verify-token", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          navigate("/dashboard", { replace: true });
        } else {
          localStorage.removeItem("token");
        }
      } catch {
        localStorage.removeItem("token");
      }
    };
    verifyToken();
  }, [navigate]);

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
