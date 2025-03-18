import express from 'express';
import { getPoints, gainPoints } from '../controllers/points.controller.js';

const router = express.Router();

router.get("/points/email/:email", getPoints);
router.post("/points/email/:email/gain-points", gainPoints);

export default router;