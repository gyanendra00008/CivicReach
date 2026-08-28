const { Resend } = require("resend");
const nodemailer = require("nodemailer");
require("dotenv").config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Gmail / SMTP fallback config
const hasSmtpCredentials = Boolean(
  (process.env.EMAIL_USER && process.env.EMAIL_PASS) ||
  (process.env.EMAIL_USER && process.env.GOOGLE_REFRESH_TOKEN)
);

let transporter = null;
if (!resend && hasSmtpCredentials) {
  let transportConfig;
  if (process.env.EMAIL_PASS) {
    transportConfig = {
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
      greetingTimeout: 8000,
      socketTimeout: 15000,
    };
  } else {
    transportConfig = {
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
      greetingTimeout: 8000,
      socketTimeout: 15000,
    };
  }

  transporter = nodemailer.createTransport(transportConfig);

  if (process.env.NODE_ENV !== "test") {
    transporter.verify((error) => {
      if (error) {
        console.warn("⚠️  [EMAIL SERVICE WARNING]:", error.message);
      } else {
        console.log("✅ [EMAIL SERVICE] Gmail transporter is ready");
      }
    });
  }
}

if (resend) {
  console.log("✅ [EMAIL SERVICE] Using Resend API for email delivery");
} else if (transporter) {
  console.log("ℹ️  [EMAIL SERVICE] Using Gmail SMTP (Nodemailer) for email delivery");
} else {
  console.log("⚠️  [EMAIL SERVICE] No email credentials configured (RESEND_API_KEY or EMAIL_USER/EMAIL_PASS). Running in console log fallback mode.");
}

const sendEmail = async (to, subject, text, html) => {
  // Always log OTP visibly in server console for easy testing/debugging
  console.log("\n=======================================================");
  console.log(`📧 [EMAIL / OTP NOTIFICATION]`);
  console.log(`   To: ${to}`);
  console.log(`   Subject: ${subject}`);
  console.log(`   Content: ${text}`);
  console.log("=======================================================\n");

  // 1. Try Resend if configured
  if (resend) {
    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || "CivicReach <onboarding@resend.dev>";
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [to],
        subject: subject,
        text: text,
        html: html,
      });

      if (error) {
        console.error("❌ Resend API Error:", error.message || error);
        return { success: false, error: error.message || error };
      }

      console.log("✅ Email sent successfully via Resend to %s (ID: %s)", to, data?.id);
      return { success: true, messageId: data?.id };
    } catch (err) {
      console.error("❌ Error sending email via Resend to", to, ":", err.message);
      return { success: false, error: err.message };
    }
  }

  // 2. Try Nodemailer if configured
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"Civic Reach" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
      });
      console.log("✅ Email sent successfully via Nodemailer to %s (ID: %s)", to, info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error("❌ Error sending email via Nodemailer to", to, ":", err.message);
      return { success: false, error: err.message };
    }
  }

  // 3. Dev / Fallback mode
  return { success: true, messageId: "dev-console-mode" };
};

module.exports = { sendEmail };