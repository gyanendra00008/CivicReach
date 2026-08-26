const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  otpHash: {
    type: String,
    required: [true, 'OTP is required']},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "User is required"],
  },

  purpose: {
        type: String,
        enum: ["registration", "login"],
        required: true
    },

  createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }

}); 

const otpModel = mongoose.model('otp', otpSchema);

module.exports = otpModel;