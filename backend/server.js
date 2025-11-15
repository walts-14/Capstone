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
    "https://www.wesign.games",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

//security headers
app.use(helmet());

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

// Explicit API 404 handler: return JSON for unknown API endpoints
app.use('/api', (_req, res) => {
  return res.status(404).json({
    error: 'API endpoint not found',
    message: 'This is a backend API server. Frontend should be deployed separately.'
  });
});
// Connect to database
connectDB();

// Serve static files (only needed if you're serving frontend from backend)
// Vite outputs the production build to `dist` by default. Serve `dist`.
// Serve static files only when explicitly enabled (frontend served from backend)
// Set environment variable `SERVE_FRONTEND=true` when you want the backend
// to serve the production frontend bundle (Vite `dist` or project root).
import fs from 'fs';
const serveFrontend = process.env.SERVE_FRONTEND === 'true';

if (serveFrontend) {
  // Prefer Vite default `dist` folder, fall back to project root.
  const distIndex = './dist/index.html';
  const rootIndex = './index.html';
  if (fs.existsSync(distIndex)) {
    app.use(express.static('./dist'));
    app.get('*', (req, res) => {
      // Only serve index.html for browser requests that accept html
      if (req.accepts && req.accepts('html')) {
        return res.sendFile('index.html', { root: './dist' });
      }
      return res.status(404).json({ error: 'Not found' });
    });
  } else if (fs.existsSync(rootIndex)) {
    app.use(express.static('./'));
    app.get('*', (req, res) => {
      if (req.accepts && req.accepts('html')) {
        return res.sendFile('index.html', { root: './' });
      }
      return res.status(404).json({ error: 'Not found' });
    });
  }
} else {
  // If frontend is deployed separately, respond at root with a short JSON
  // message and return JSON 404s for any other non-API paths.
  app.get('/', (_req, res) => {
    res.json({ ok: true, message: 'Backend API server running. Frontend is deployed separately.' });
  });

  // Non-API fallback: any unknown non-API route should return JSON 404.
  app.use((req, res) => {
    // If the request path begins with /api or /comm we already handled it above.
    // For other paths, return a JSON 404 so clients (including fetch/XHR)
    // receive a useful response instead of an HTML page.
    return res.status(404).json({ error: 'Not found' });
  });
}

const PORT = process.env.PORT || 5000;
if (!serveFrontend) {
  console.log('Backend-only mode: static frontend serving is disabled.');
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
