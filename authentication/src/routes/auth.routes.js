const express=require('express');
const authrouter=express.Router();

const {register,verifyEmail,login}=require('../controller/auth.controller')



authrouter.post("/register",register) 
authrouter.post("/verify-email",verifyEmail)
authrouter.post("/login",login)


module.exports=authrouter;