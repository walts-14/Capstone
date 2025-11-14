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

//configuring dotenv
dotenv.config();
//console.log('ENV: SMTP_HOST=%s SMTP_PORT=%s', process.env.SMTP_HOST, process.env.SMTP_PORT);
//initializing express
const app = express();
//middleware
app.use(express.json());

app.use(compression());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
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
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
