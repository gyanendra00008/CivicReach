const mongoose= require("mongoose")

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "User is required"],
  },
  refreshTokenHash: {
    type: String,
    required: [true, "Refresh token hash is required"],
  },
  ip: {
    type: String,
    default: "unknown",
  },
  userAgent: {
    type: String,
    default: "unknown",
  },
  revoked: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true }); 

const sessionModel=mongoose.model("sessions",sessionSchema)

module.exports=sessionModel;