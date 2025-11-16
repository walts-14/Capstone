import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "https://wesign-backend-cef3encxhphtg0ds.eastasia-01.azurewebsites.net";

axios.defaults.baseURL = API_BASE;
axios.defaults.withCredentials = true; // important so cookies (httpOnly) are sent
// If you still use token in localStorage for normal login, set header as well:
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Global fetch shim: rewrite relative `/api` calls to the backend domain so
// existing `fetch('/api/...')` calls from the frontend target the backend
// host instead of the current origin. This avoids editing many files.
try {
  if (typeof window !== "undefined" && window.fetch) {
    const _origFetch = window.fetch.bind(window);
    window.fetch = (input, init) => {
      try {
        // If input is a string path starting with /api, rewrite it.
        if (typeof input === "string") {
          if (input.startsWith("/api")) {
            return _origFetch(API_BASE + input, init);
          }
          // relative paths like './api/..' are left alone
        }

        // If input is a Request object, and its URL path starts with /api
        if (input && input.url) {
          try {
            const parsed = new URL(input.url, window.location.href);
            if (parsed.pathname.startsWith("/api")) {
              const newUrl = API_BASE + parsed.pathname + parsed.search;
              const newReq = new Request(newUrl, input);
              return _origFetch(newReq, init);
            }
          } catch (e) {
            // fallthrough to original fetch
          }
        }
      } catch (e) {
        // If anything goes wrong rewriting, fall back to original fetch
      }
      return _origFetch(input, init);
    };
  }
} catch (e) {
  // ignore in non-browser environments
}

export default axios;
