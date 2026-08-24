const express=require("express")
const app=express();
const authrouter=require("./routes/auth.routes")
const morgan= require("morgan");
const cookieParser=require("cookie-parser");

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser())
app.use("/api/auth",authrouter)

module.exports=app;