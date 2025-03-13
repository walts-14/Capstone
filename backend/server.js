import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user.route.js';
import LessonOneQuiz from './routes/LessonRoutes/LessonOne/quizOne.route.js';
import authRoutes from './routes/authRoutes.js';
import { connectDB}  from './config/db.js';
import streakRoutes from "./routes/streakRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";

//initializing express
const app = express();
//middleware
app.use(express.json());
//configuring dotenv
dotenv.config();

app.use(
    cors({     
        credentials: true,
        origin: 'http://localhost:5173',
    })
)

app.use("/api", userRoutes);
app.use("/api", LessonOneQuiz);
app.use("/api", authRoutes);
app.use("/api", streakRoutes);
app.use("/api", leaderboardRoutes);

app.listen(5000, () => {
    connectDB();
    console.log('Server is running on port 5000');
    });

   