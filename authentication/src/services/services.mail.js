const nodemailer = require("nodemailer");
require("dotenv").config();

let transportConfig;

if (process.env.EMAIL_PASS) {
  // Standard Google App Password authentication
  transportConfig = {
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };
} else {
  // Google OAuth2 authentication
  transportConfig = {
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  };
}

const transporter = nodemailer.createTransport(transportConfig);

if (process.env.NODE_ENV !== "test") {
  transporter.verify((error) => {
    if (error) {
      console.warn("⚠️  Email Service Warning:", error.message);
      console.warn("   (If OTP emails fail, verify your Gmail OAuth tokens or use a Google App Password with EMAIL_PASS in .env)");
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