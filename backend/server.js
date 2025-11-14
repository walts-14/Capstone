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
import messageRoutes from "./routes/messageRoute.js"; // Import message feature
import compression from "compression";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

//configuring dotenv
dotenv.config();
//console.log('ENV: SMTP_HOST=%s SMTP_PORT=%s', process.env.SMTP_HOST, process.env.SMTP_PORT);
//initializing express
const app = express();
//middleware
app.use(express.json());

app.use(compression());

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL,
  })
);

//security headers
app.use(helmet());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/comm', commRoutes);
app.use(cookieParser());

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
app.use("/api/messages", messageRoutes); // Message feature API

connectDB();
//verifySmtp();

// Serve frontend static files.
// The project may put the built frontend in different locations depending on CI/config:
// - backend/build (older setups)
// - backend/dist (if Vite output moved into backend)
// - ../dist (root/dist) when frontend is built at repo root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const possibleStaticDirs = [
  path.join(__dirname, 'build'),
  path.join(__dirname, 'dist'),
  path.join(__dirname, '..', 'dist'),
  path.join(__dirname, '..', 'build'),
];

const staticDir = possibleStaticDirs.find((d) => fs.existsSync(d)) || path.join(__dirname, 'build');

app.use(express.static(staticDir));

app.get('*', (_req, res) => {
  const indexPath = path.join(staticDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Client build not found on server. Looked for: ' + indexPath });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
