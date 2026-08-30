const express=require('express');
const authrouter=express.Router();

const {register,verifyEmail,login,verifyLoginOtp,refreshToken,getme, logout, resetPassword}=require('../controller/auth.controller')



authrouter.post("/register",register) 
authrouter.post("/verify-email",verifyEmail)
authrouter.post("/login",login)
authrouter.post("/verify-login",verifyLoginOtp)
authrouter.get("/getme",getme)
authrouter.post("/refresh-token",refreshToken)
authrouter.post("/logout",logout)
authrouter.post("/reset-password",resetPassword)

module.exports=authrouter;