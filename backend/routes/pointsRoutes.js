import express from 'express';
import { getPoints, gainPoints } from '../controllers/points.controller.js';

const router = express.Router();

router.get("/email/:email", getPoints);
router.post("/email/:email/gain-points", gainPoints);

export default router;


