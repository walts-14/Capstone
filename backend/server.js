import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/user.route.js';
import { connectDB}  from './config/db.js';
import mongoose from 'mongoose';

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

app.use("/api", authRoutes);

app.listen(5000, () => {
    connectDB();
    console.log('Server is running on port 5000');
    });