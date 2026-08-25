const mongoose= require("mongoose")

const schema= new mongoose.Schema({
  username:{
    type:String,
    required: [true,"Username is required"], 
    unique:[true,"Username must be unique"]
  } ,
  email:{
    type:String,
    required: [true,"Email is required"], 
    unique:[true,"Email must be unique"]
  },
  password:{
    type:String,
    required: [true,"Password is required"], 
    unique:[true,"Password must be unique"]
  },
  verified:{
    type:Boolean,
    default:false
  }
})

const usermodel=mongoose.model("user",schema)

module.exports=usermodel;