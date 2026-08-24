const app=require("./src/app")
const connectDB= require("./src/db/db")
require("dotenv").config()

connectDB();

app.listen("4000",()=>{
  console.log("Server started");
})