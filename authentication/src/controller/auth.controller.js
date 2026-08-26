const jwt = require("jsonwebtoken");
const usermodel = require("../model/user.model");
const sessionModel = require("../model/session.model");
const otpModel = require("../model/otp.model");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../services/services.mail");
const { generateOtp, getOtpHtml } = require("../services/utils");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.trim();

    const existingUser = await usermodel.findOne({
      $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
    });

    if (existingUser) {
      // Already has a verified account
      if (existingUser.verified) {
        return res.status(409).json({
          message: "Username or email already exists!",
        });
      }

      // If user exists but is not verified, generate new OTP and re-send
      const otp = generateOtp();
      const otpHash = await bcrypt.hash(otp, 12);
      const html = getOtpHtml(otp, "registration");

      await otpModel.findOneAndUpdate(
        { email: normalizedEmail, user: existingUser._id, purpose: "registration" },
        { otpHash },
        { upsert: true, new: true }
      );

      await sendEmail(normalizedEmail, "OTP Verification", `Your OTP code is ${otp}`, html);

      return res.status(200).json({
        message: "Verification OTP sent again",
      });
    }

    const hashedPass = await bcrypt.hash(password, 12);

    // Creating unverified user
    const user = await usermodel.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPass,
    });

    const otp = generateOtp();
    const html = getOtpHtml(otp, "registration");
    const otpHash = await bcrypt.hash(otp, 12);

    await otpModel.findOneAndUpdate(
      { email: normalizedEmail, user: user._id, purpose: "registration" },
      { otpHash },
      { upsert: true, new: true }
    );

    await sendEmail(normalizedEmail, "OTP Verification", `Your OTP code is ${otp}`, html);

    return res.status(201).json({
      message: "User created. Please check your email for OTP verification.",
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function verifyEmail(req, res, next) {
  try {
    const { otp, email } = req.body;

    if (!otp || !email) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const otpRecord = await otpModel.findOne({
      email: normalizedEmail,
      purpose: "registration",
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "OTP expired or invalid",
      });
    }

    const isValid = await bcrypt.compare(String(otp), otpRecord.otpHash);

    if (!isValid) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    const user = await usermodel.findById(otpRecord.user);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.verified = true;
    await user.save();

    await otpModel.deleteOne({ email: normalizedEmail, purpose: "registration" });

    return res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await usermodel.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.verified) {
      return res.status(401).json({ message: "User not verified. Please verify your email." });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate OTP
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 12);

    // Store / upsert OTP
    await otpModel.findOneAndUpdate(
      { email: normalizedEmail, user: user._id, purpose: "login" },
      { otpHash },
      { upsert: true, new: true }
    );

    // Send OTP
    const html = getOtpHtml(otp, "login");
    await sendEmail(normalizedEmail, "Login OTP", `Your login OTP is ${otp}`, html);

    return res.status(200).json({
      message: "OTP sent to your email",
      email: normalizedEmail,
    });
  } catch (error) {
    next(error);
  }
}

async function verifyLoginOtp(req, res, next) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await usermodel.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otpRecord = await otpModel.findOne({
      email: normalizedEmail,
      user: user._id,
      purpose: "login",
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "OTP not found or expired",
      });
    }

    const isValid = await bcrypt.compare(String(otp), otpRecord.otpHash);
    if (!isValid) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // OTP is correct
    await otpModel.deleteOne({ _id: otpRecord._id });

    const session = new sessionModel({
      user: user._id,
      ip: req.ip || req.socket?.remoteAddress || "unknown",
      userAgent: req.headers["user-agent"] || "unknown",
    });

    // Generate refresh token
    const refreshToken = jwt.sign(
      { id: user._id, sessionId: session._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    session.refreshTokenHash = hashedRefreshToken;
    await session.save();

    // Generate access token
    const accessToken = jwt.sign(
      { id: user._id, sessionId: session._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(200).json({
      message: "Logged in successfully",
      user: {
        username: user.username,
        email: user.email,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
}

async function refreshToken(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token not found",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
      });
    }

    // Find the active session
    const session = await sessionModel.findOne({
      _id: decoded.sessionId,
      user: decoded.id,
      revoked: false,
    });

    if (!session) {
      return res.status(401).json({
        message: "Invalid refresh token or session revoked",
      });
    }

    const isValid = await bcrypt.compare(refreshToken, session.refreshTokenHash);
    if (!isValid) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const accessToken = jwt.sign(
      { id: decoded.id, sessionId: decoded.sessionId },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
      { id: decoded.id, sessionId: decoded.sessionId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 12);
    session.refreshTokenHash = hashedNewRefreshToken;
    await session.save();

    res.cookie("refreshToken", newRefreshToken, cookieOptions);

    return res.status(200).json({
      message: "Token refreshed",
      accessToken,
      token: accessToken,
    });
  } catch (error) {
    next(error);
  }
}

async function getme(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({
        message: "Token not found",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        message: err.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
      });
    }

    const user = await usermodel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Fetched details successfully",
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token not found",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (error) {
      res.clearCookie("refreshToken", cookieOptions);
      return res.status(401).json({
        message: "Invalid or expired refresh token",
      });
    }

    const session = await sessionModel.findOne({
      _id: decoded.sessionId,
      user: decoded.id,
      revoked: false,
    });

    if (session) {
      session.revoked = true;
      await session.save();
    }

    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  verifyEmail,
  login,
  refreshToken,
  verifyLoginOtp,
  getme,
  logout,
};