import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import livesRoutes from "./routes/livesRoutes.js";
import pointsRoutes from "./routes/pointsRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import superadminRoutes from "./routes/superadminRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import streakRoutes from "./routes/streakRoutes.js";

//initializing express
const app = express();
//middleware
app.use(express.json());
//configuring dotenv
dotenv.config();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

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

app.listen(5000, () => {
  connectDB();
  console.log("Server is running on port 5000");
});
