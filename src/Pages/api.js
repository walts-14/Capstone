import axios from "axios";

axios.defaults.baseURL =
  import.meta.env.VITE_API_BASE ||
  "https://wesign-backend-cef3encxhphtq0ds.eastasia-01.azurewebsites.net";
axios.defaults.withCredentials = true; // important so cookies (httpOnly) are sent
// If you still use token in localStorage for normal login, set header as well:
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default axios;
