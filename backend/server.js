import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use("/", authRoutes);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
    });