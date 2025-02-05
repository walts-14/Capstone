import express from 'express';
import cors from 'cors';
import { test } from '../controllers/authController.js';

const router = express.Router();

router.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
)

router.get('/', test)

export default router;