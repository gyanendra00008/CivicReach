require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Authentication server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server due to database connection error.");
    process.exit(1);
  }
}

startServer();

