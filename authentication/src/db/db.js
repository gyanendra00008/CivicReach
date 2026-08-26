const mongoose = require("mongoose");

async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in your .env file");
    }
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to MongoDB database successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    if (error.name === "MongooseServerSelectionError" || error.message.includes("ETIMEDOUT")) {
      console.error("\n⚠️  IMPORTANT: If your server timed out connecting to MongoDB Atlas:");
      console.error("1. Go to MongoDB Atlas (https://cloud.mongodb.com)");
      console.error("2. Navigate to 'Network Access' -> 'IP Access List'");
      console.error("3. Click 'Add IP Address' and add your Current IP Address (or 0.0.0.0/0 for testing)");
      console.error("4. Check if your ISP / firewall blocks port 27017\n");
    }
    throw error;
  }
}

module.exports = connectDB;