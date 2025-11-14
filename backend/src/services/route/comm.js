import express from "express";
import { sendEmail } from "../mailer.js";
import { toDataUrl, toPngBuffer } from "../qr.js";

const router = express.Router();

router.post("/test-email", async (req, res) => {
  const { to = "test@example.com" } = req.body || {};
  try {
    const result = await sendEmail({
      to,
      subject: "WeSign test email",
      html: "<h1>Hello from WeSign</h1><p>This is a test.</p>",
    });
    return res.json({ ok: true, message: "Email sent", result });
  } catch (err) {
    console.error("/comm/test-email error:", err?.message || err);
    return res.status(500).json({ ok: false, error: err?.message || "send failed" });
  }
});

// 1) Return a QR as a Data URL
router.get("/qr-data-url", async (req, res) => {
  const { text = "https://example.com" } = req.query;
  const dataUrl = await toDataUrl(text);
  res.json({ dataUrl });
});

// 2) Stream a QR PNG
router.get("/qr.png", async (req, res) => {
  const { text = "https://example.com" } = req.query;
  const png = await toPngBuffer(text);
  res.setHeader("Content-Type", "image/png");
  res.send(png);
});

export default router;   // ✅ Use ES export
