// src/services/mailer.js
import nodemailer from "nodemailer";

function createTransporter() {
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
    if (!process.env.SMTP_HOST) {
      //console.warn('verifyConnection: SMTP_HOST not set; skipping real verify (dev fallback)');
      return;
    }
    const transporter = createTransporter();
    await transporter.verify();
    //console.log("SMTP connected & ready");
  } catch (err) {
    console.error("SMTP verify failed:", err?.message || err);
  }
}

export async function sendEmail({ to, subject, html, attachments = [] }) {
  // dev fallback if SMTP not configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    //console.warn("SMTP not configured — logging email to console (dev fallback)");
   // console.log({ to, subject, html, attachmentsLength: attachments.length });
    return { accepted: [to] };
  }

  const transporter = createTransporter();
  return transporter.sendMail({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to,
    subject,
    html,
    attachments
  });
}
