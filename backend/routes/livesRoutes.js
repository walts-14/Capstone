import express from 'express';
import { gainLife, loseLife, getLives, regenerateLives } from '../controllers/lives.controller.js';

const router = express.Router();

router.get("/lives/email/:email", getLives);
router.post("/lives/email/:email/lose-life", loseLife);
router.post("/lives/email/:email/gain-life", gainLife);
router.post("/lives/email/:email/regenerate", regenerateLives);

export default router;
