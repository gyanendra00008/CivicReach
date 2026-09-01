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
    console.error(" MongoDB Connection Error:", error.message);
   
    throw error;
  }
}

module.exports = connectDB;
