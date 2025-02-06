import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import mongoose from 'mongoose';

//initializing express
const app = express();
//middleware
app.use(express.json());
//configuring dotenv
dotenv.config();

//database connection
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Database connected")}).catch((err) => console.log("Database connection failed", err));



app.use("/", authRoutes);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
    });