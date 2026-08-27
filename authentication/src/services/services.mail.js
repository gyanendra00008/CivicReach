const nodemailer = require("nodemailer");
require("dotenv").config();

let transportConfig;

if (process.env.EMAIL_PASS) {
  // Standard Google App Password authentication using Port 465 SSL
  transportConfig = {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT, 10) || 465,
    secure: process.env.EMAIL_SECURE ? process.env.EMAIL_SECURE === "true" : true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  };
} else {
  // Google OAuth2 authentication
  transportConfig = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
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
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  };
}

const transporter = nodemailer.createTransport(transportConfig);

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

const sendEmail = async (to, subject, text, html) => {
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
    throw error;
  }
};

module.exports = { sendEmail };