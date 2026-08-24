const express=require('express');
const authrouter=express.Router();

const {register}=require('../controllers/auth.controller')



authrouter.post("/register",register) 


module.exports=authrouter;