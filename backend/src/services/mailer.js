// src/services/mailer.js
import nodemailer from "nodemailer";

function createTransporter() {
  // Prefer explicit Gmail credentials when provided (uses nodemailer's "gmail" service)
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_PASS;

  if (gmailUser && gmailPass) {
    // Using service: 'gmail' lets nodemailer pick the right host/port/security
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
      logger: true,
      debug: true
    });
  }

  // Fall back to generic SMTP_* environment variables (e.g. Mailtrap or other SMTP)
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // console.log('createTransporter() using SMTP_HOST=%s SMTP_PORT=%s SMTP_USER=%s', host, port, user ? '***' : 'undefined');

  const config = {
    host,
    port,
    secure: port === 465,
    logger: true,
    debug: true
  };

  if (user && pass) config.auth = { user, pass };

  return nodemailer.createTransport(config);
}

export async function verifyConnection() {
  try {
    const smtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER;
    const gmailConfigured = process.env.GMAIL_USER && process.env.GMAIL_PASS;

    if (!smtpConfigured && !gmailConfigured) {
      //console.warn('verifyConnection: no SMTP or Gmail config found; skipping verify (dev fallback)');
      return;
    }

    const transporter = createTransporter();
    await transporter.verify();
    console.log("SMTP/Gmail connected & ready");
  } catch (err) {
    console.error("SMTP verify failed:", err?.message || err);
  }
}

export async function sendEmail({ to, subject, html, attachments = [] }) {
  // dev fallback if neither SMTP nor Gmail are configured
  const smtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER;
  const gmailConfigured = process.env.GMAIL_USER && process.env.GMAIL_PASS;
  if (!smtpConfigured && !gmailConfigured) {
    //console.warn("SMTP/Gmail not configured — logging email to console (dev fallback)");
    // console.log({ to, subject, html, attachmentsLength: attachments.length });
    return { accepted: [to] };
  }

  const transporter = createTransporter();
  try {
    const result = await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to,
      subject,
      html,
      attachments
    });
    console.log("Email send result:", {
      to: result.accepted || to,
      messageId: result.messageId,
      response: result.response
    });
    return result;
  } catch (err) {
    console.error("sendEmail failed:", err?.message || err);
    // rethrow so callers can react (controllers will log/return 500)
    throw err;
  }
}
