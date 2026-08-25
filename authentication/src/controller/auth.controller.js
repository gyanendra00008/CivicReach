const jwt=require("jsonwebtoken")
const usermodel=require("../model/user.model")
const sessionModel=require("../model/session.model")
const otpModel=require("../model/otp.model")
const bcrypt=require("bcrypt")
const {sendEmail}=require("../services/services.mail")
const {generateOtp, getOtpHtml}=require("../services/utils")
require("dotenv").config();

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


async function verifyLoginOtp(req,res){
      const { email, otp } = req.body;

    const user = await usermodel.findOne({ email });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const otpRecord = await otpModel
        .findOne({ email, user: user._id,purpose: "login" })

    if (!otpRecord) {
        return res.status(400).json({
            message: "OTP not found or expired"
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

    // OTP is correct
    await otpModel.deleteOne({
        _id: otpRecord._id
    });

    const session = new sessionModel({
  user: user._id,
  ip:req.ip,
    userAgent: req.headers["user-agent"]
});

      // Generate refresh token
  const refreshToken = jwt.sign(
    { id: user._id, sessionId:session._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  session.refreshTokenHash=hashedRefreshToken;
  await session.save();

  
  // Generate access token
  const accessToken = jwt.sign(
    { id: user._id , sessionId: session._id},
   process.env.JWT_SECRET,
    { expiresIn: "10min" }
  );

  // Set refresh token in cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return res.status(200).json({
    message: "Logged in successful",
    user:{
      username:user.username,
      email:user.email
    },
    accessToken
  });


}

async function refreshToken(req,res){
  const refreshToken=req.cookies.refreshToken; //see in postman cookie section
  if(!refreshToken){
    return res.status(401).json({
      message:"Refresh token not found"
    })
  }
  let decoded;

  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET
    );
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired refresh token"
    });
  }
    // Find the session
  const session = await sessionModel.findOne({
    _id: decoded.sessionId,
    user: decoded.id,
    revoked: false
  });

  if (!session) {
    return res.status(401).json({
      message: "Invalid refresh token"
    });
  }

  const isValid = await bcrypt.compare(
    refreshToken,
    session.refreshTokenHash
  );

    if (!isValid) {
    return res.status(401).json({
      message: "Invalid refresh token"
    });
  }

  const accessToken=jwt.sign({
    id: decoded.id
     },process.env.JWT_SECRET, //JWT Secret   
     { expiresIn: "15m"} //token expiry
    )

    //refresh token is also generated again, because if user is using refresh token for a long time, then it will expire, so we need to generate new refresh token also
 const newRefreshToken= jwt.sign({
    id:decoded.id,
     sessionId:decoded.sessionId },
    process.env.JWT_SECRET,
    {expiresIn:"7d"}

  )

   // Hash new refresh token
  const hashedNewRefreshToken = await bcrypt.hash(
    newRefreshToken,
    12
  );
  // Replace old hash with new hash
  session.refreshTokenHash = hashedNewRefreshToken;

  await session.save();



  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true, //this cookie cannot be accessed by client side js, only server can access it
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  })

  res.status(200).json({
    message:"Token refreshed",
    token: accessToken
  })
}


async function getme(req,res){

  const token=req.headers.authorization?.split(" ")[1] 

  if(!token){
    return res.status(401).json({
      message:"Token not found"
    })
  }

  let decoded;
  try {decoded= jwt.verify(token,process.env.JWT_SECRET)
  }
  catch(err){
    return res.status(401).json({
      message: err.name
    })
  }

   const user=await usermodel.findById(decoded.id)
 
   res.status(200).json({
    message:"fetched details",
    username:user.username,
    email:user.email
   })
}

async function logout(req,res){
  const refreshToken=req.cookies.refreshToken; 
  if(!refreshToken){
    return res.status(401).json({
      message:"Refresh token not found"
    })
  }

   let decoded;

  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET
    );
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired refresh token"
    });
  }

  // Find the session using session ID
  const session = await sessionModel.findOne({
    _id: decoded.sessionId,
    user: decoded.id,
    revoked: false
  });

  if (!session) {
    return res.status(401).json({
      message: "Session not found or already revoked"
    });
  }

  // Compare refresh token with bcrypt hash
  const isValid = await bcrypt.compare(
    refreshToken,
    session.refreshTokenHash
  );

  if (!isValid) {
    return res.status(401).json({
      message: "Invalid refresh token"
    });
  }

  session.revoked=true;
  await session.save(); //this will update the session in db, so that user cannot use that refresh token again to get new access token

  res.clearCookie("refreshToken") //this will clear the cookie from client side

  res.status(200).json({
    message:"Logged out successfully"
  })
}

module.exports={register,verifyEmail,login,refreshToken, verifyLoginOtp, getme,logout}