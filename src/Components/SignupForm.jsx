import React from "react";
import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "../css/SignupForm.css";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useUserStore } from "../handleUser/user";

function SignupForm() {
  const navigate = useNavigate();

  const [newUser, setNewUser] = React.useState({
    age: "",
    year: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { createUser } = useUserStore();

  const signupUser = async (e) => {
    
    const  { success, message } = await createUser(newUser);

    if (!success) {
      toast ({
        title: "Error",
        description: message,
        status: "error",
        isClosable: true,
      })}
    else {
      toast ({
        title: "Success",
        description: message,
        status: "success",
        isClosable: true,
      })};

      setNewUser({ age: "", year: "", name: "", email: "", password: "", confirmPassword: "" });
    };

  return (
    <div className="signup-container">
      <div className="signup-card signup-width">
        <h1>Sign Up</h1>
        <Form >
          <Form.Group className="input d-flex mb-2">
            <Form.Control
              type="number"
              placeholder="Age"
              className="login-input input-height"
              name="age"
              value={newUser.age}
              onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
            />
            <Form.Control
              type="text"
              placeholder="Year-Section"
              className="login-input input-height"
              name="year"
              value={newUser.year}
              onChange={(e) => setNewUser({ ...newUser, year: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Control
              type="text"
              placeholder="Name"
              className="login-input input-height"
              name="name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Control
              type="email"
              placeholder="Email"
              className="login-input input-height"
              name="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Control
              type="password"
              placeholder="Password"
              className="login-input input-height"
              name="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              className="login-input input-height"
              name="confirmPassword"
              value={newUser.confirmPassword}
              onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
            />
          </Form.Group>

          <Button type="submit" className="button-login" onSubmit={signupUser}>
            Submit
          </Button>
        </Form>

        <div className="sign-up">
          <p className="text-center text-light">
            Already have an account?{" "}
            <a href="/login" className="">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
