import axios from "axios";

// Create an Axios instance with a default base URL
const API = axios.create({
  baseURL: "http://localhost:5000/api", // Change this if your backend URL is different
});

export default API;