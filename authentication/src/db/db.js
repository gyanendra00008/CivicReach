const mongoose = require("mongoose");

async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI (or MONGO_URI) is not defined in environment variables");
    }
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log("Connected to MongoDB database successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    if (error.name === "MongooseServerSelectionError" || error.message.includes("ETIMEDOUT")) {
      console.error("\n⚠️  IMPORTANT: If your server timed out connecting to MongoDB Atlas:");
      console.error("1. Go to MongoDB Atlas (https://cloud.mongodb.com)");
      console.error("2. Navigate to 'Network Access' -> 'IP Access List'");
      console.error("3. Click 'Add IP Address' and add '0.0.0.0/0' (Allow Access from Anywhere) so Render can connect");
      console.error("4. Check if your database username and password in MONGODB_URI are correct\n");
    }
    throw error;
  }
}

module.exports = connectDB;