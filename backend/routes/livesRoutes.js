import express from 'express';
import { gainLife, loseLife, getLives  } from '../controllers/lives.controller.js';

const router = express.Router();

router.get("/lives/:id", getLives);
router.get("/lives/:id", gainLife);
router.get("/lives/:id", loseLife);

export default router;