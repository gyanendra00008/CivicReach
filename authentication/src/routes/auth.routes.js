const express=require('express');
const authrouter=express.Router();

const {register,verifyEmail}=require('../controller/auth.controller')



authrouter.post("/register",register) 
authrouter.post("/verify-email",verifyEmail)


module.exports=authrouter;