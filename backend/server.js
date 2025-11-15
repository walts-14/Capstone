import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import commRoutes from "./src/services/route/comm.js";
import cookieParser from "cookie-parser";
import { verifyConnection as verifySmtp } from "./src/services/mailer.js";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import livesRoutes from "./routes/livesRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import superadminRoutes from "./routes/superadminRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import streakRoutes from "./routes/streakRoutes.js";
import pointsRoutes from "./routes/pointsRoutes.js";
import messageRoutes from "./routes/messageRoute.js";
import compression from "compression";

//configuring dotenv
dotenv.config();

//initializing express
const app = express();

//middleware
app.use(express.json());
app.use(compression());
app.use(cookieParser());

// CORS configuration - single unified config
const corsOptions = {
  origin: [
    "https://wesign.games",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

//security headers
// Configure a Content Security Policy that allows the frontend to
// `connect` (XHR/fetch) to the backend API and local dev servers.
const cspDirectives = {
  defaultSrc: ["'self'"],
  // allow XHR/fetch/websocket connections to our backend and localhost during dev
  connectSrc: [
    "'self'",
    "https://wesign-backend-cef3encxhphtq0ds.eastasia-01.azurewebsites.net",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  // allow scripts/styles/images from self and inline where Vite needs it
  scriptSrc: ["'self'", "'unsafe-inline'"],
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'", "data:", "blob:"],
  frameAncestors: ["'none'"],
};

app.use(
  helmet.contentSecurityPolicy({
    directives: cspDirectives,
  })
);

// Health check endpoint
app.get("/health", (_req, res) => res.json({ ok: true }));

// API routes
app.use("/comm", commRoutes);
app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", leaderboardRoutes);
app.use("/api", livesRoutes);
app.use("/api", pointsRoutes);
app.use("/api", videoRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/superadmin", superadminRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/streak", streakRoutes);
app.use("/api/points", pointsRoutes);
app.use("/api/messages", messageRoutes);

// Connect to database
connectDB();

// Serve static files (only needed if you're serving frontend from backend)
// Vite outputs the production build to `dist` by default. Serve `dist`.
// import fs from "fs";
// // If `dist` exists (Vite default), serve it. Some deployment flows deploy
// // the dist contents directly into `wwwroot` (no `dist` folder), so fall
// // back to serving the app root when `dist` is missing.
// if (fs.existsSync("./dist/index.html")) {
//   app.use(express.static("./dist"));
//   app.get("*", (_req, res) => {
//     res.sendFile("index.html", { root: "./dist" });
//   });
// } else {
//   // Serve from project root (wwwroot) where index.html may be placed directly
//   app.use(express.static("./"));
//   app.get("*", (_req, res) => {
//     res.sendFile("index.html", { root: "./" });
//   });
// }

// Add a catch-all for undefined API routes
app.get("*", (_req, res) => {
  res.status(404).json({
    error: "API endpoint not found",
    message:
      "This is a backend API server. Frontend should be deployed separately.",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
