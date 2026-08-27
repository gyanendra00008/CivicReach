const nodemailer = require("nodemailer");
require("dotenv").config();

const hasEmailCredentials = Boolean(
  (process.env.EMAIL_USER && process.env.EMAIL_PASS) ||
  (process.env.EMAIL_USER && process.env.GOOGLE_REFRESH_TOKEN)
);

let transporter = null;

if (hasEmailCredentials) {
  let transportConfig;
  if (process.env.EMAIL_PASS) {
    // Standard Google App Password authentication using Port 587 STARTTLS
    transportConfig = {
      host: "smtp.gmail.com",
      port: 587,
      secure:  false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      family: 4, // Force IPv4 to avoid ENETUNREACH errors on IPv6-unsupported networks like Render
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    };
  } else {
    // Google OAuth2 authentication
    transportConfig = {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
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
      family: 4, // Force IPv4 to avoid ENETUNREACH errors on IPv6-unsupported networks like Render
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    };
  }

  console.log("SMTP CONFIG:", {
  host: transportConfig.host,
  port: transportConfig.port,
  secure: transportConfig.secure,
  family: transportConfig.family,
});

  transporter = nodemailer.createTransport(transportConfig);

  if (process.env.NODE_ENV !== "test") {
    transporter.verify((error) => {
      if (error) {
        console.warn("⚠️  Email Service Warning:", error.message);
        console.warn("   (If OTP emails fail, verify your Gmail App Password with EMAIL_PASS in Render/env)");
      } else {
        console.log("Email server is ready to send messages");
      }
    });
  }
} else {
  console.log("⚠️  EMAIL_USER or EMAIL_PASS not set in environment. Running in fallback mode (OTPs are logged in server console, fallback 123456 accepted).");
}

const sendEmail = async (to, subject, text, html) => {
  if (!transporter) {
    console.log(`[AUTH DEMO/DEV MODE] Email to ${to}: ${subject} -> ${text}`);
    return { messageId: "dev-mock-email-id" };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Civic Reach" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent successfully: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email to", to, ":", error.message);
    console.warn("[AUTH FALLBACK] Email sending failed, continuing authentication flow.");
    return { messageId: "fallback-email-failed" };
  }
};

module.exports = { sendEmail };