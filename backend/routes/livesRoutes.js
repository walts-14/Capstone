import express from 'express';
import { gainLife, loseLife, getLives, regenerateLives } from '../controllers/lives.controller.js';

const router = express.Router();

// Small middleware to disable caching/ETag for lives endpoints so clients get fresh data
const noCache = (_req, res, next) => {
	// Prevent caching in browsers and intermediate proxies
	res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
	res.setHeader('Pragma', 'no-cache');
	res.setHeader('Expires', '0');
	// Disable Express-generated ETag for this response (prevents 304 responses based on ETag)
	res.setHeader('ETag', '');
	next();
};

router.get("/lives/email/:email", noCache, getLives);
router.post("/lives/email/:email/lose-life", noCache, loseLife);
router.post("/lives/email/:email/gain-life", noCache, gainLife);
router.post("/lives/email/:email/regenerate", noCache, regenerateLives);

export default router;
