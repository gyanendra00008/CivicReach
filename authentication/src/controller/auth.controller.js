const jwt=require("jsonwebtoken")
const usermodel=require("../model/user.model")
const sessionModel=require("../model/session.model")
const otpModel=require("../model/otp.model")
const bcrypt=require("bcrypt")
const {sendEmail}=require("../services/services.mail")
const {generateOtp, getOtpHtml}=require("../services/utils")

async function register(req,res){
  const {username, email,password}= req.body;
   const existingUser= await usermodel.findOne({
    $or:[
      {username},
      {email}
    ] 
   })
   if(existingUser){
     // Already has a verified account
    if (existingUser.verified) {
        return res.status(409).json({
            message: "Username or email already exists!"
        });
    }
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 12);
    const html=getOtpHtml(otp)
    await otpModel.findOneAndUpdate(
    { email , user:existingUser._id, purpose:"registration"},
    {
        otpHash: otpHash
    },
    { upsert: true, new: true }
);

    await sendEmail(email,"OTP Verification",`Your OTP code is ${otp}`,html)


    return res.status(200).json({
        message: "Verification OTP sent again"
    }); 
   }

   const hashedPass = await bcrypt.hash(password, 12);

    //creating user
   const user= await usermodel.create({
    username,
    email,
    password: hashedPass
   })

   const otp=generateOtp() 
   const html=getOtpHtml(otp)
   const otpHash= await bcrypt.hash(otp,12);

  //   await otpModel.create({
  //   email,
  //   user:user._id,
  //   otpHash,
  //   purpose:"registration"
  //  })
  await otpModel.findOneAndUpdate(
    { email , user:user._id, purpose:"registration"},
    {
        otpHash: otpHash
    },
    { upsert: true, new: true }
);

    await sendEmail(email,"OTP Verification",`Your OTP code is ${otp}`,html)

     res.status(201).json({
    message:"User created",
    user:{
      username:user.username,
      email:user.email
    }
   })

}

async function verifyEmail(req,res){
  const {otp, email}=req.body;
  const otpRecord = await otpModel.findOne({ email, purpose:"registration" });
  if (!otpRecord ) {
    return res.status(400).json({
        message: "OTP expired or invalid"
    });
}
  const isValid = await bcrypt.compare(
    otp,
    otpRecord.otpHash
);

 if(!isValid){
    return res.status(400).json({
      meaage:"Invalid OTP"
    })
  }

  const user= await usermodel.findById(otpRecord.user) //this will find the user with the given id in otpDoc
  user.verified=true;
  await user.save(); //this will save the user with verified true, so that user can login now

  await otpModel.deleteOne({ email , purpose:"registration"});

  return res.status(200).json({
    message: "Email verified successfully"
  });

}

async function login(req,res){
  const {email, password} = req.body;

  // Find user by email
  const user = await usermodel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if(!user.verified){
    return res.status(401).json({ message: "User not verified. Please verify your email." });
  }

  // Check if password is correct
   const isMatch = await bcrypt.compare(
    password,
    user.password
);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }
   
        // Generate OTP
    const otp = generateOtp();

    // Hash OTP before storing it
   const otpHash= await bcrypt.hash(otp,12);

    // Store OTP
    await otpModel.create({
        email,
        user: user._id,
        otpHash,
        purpose:"login"
    });

    // Send OTP
    const html = getOtpHtml(otp, "login");

    await sendEmail(
        email,
        "Login OTP",
        `Your login OTP is ${otp}`,
        html
    );

    return res.status(200).json({
        message: "OTP sent to your email",
        email
    });
  }

module.exports={register,verifyEmail,login}