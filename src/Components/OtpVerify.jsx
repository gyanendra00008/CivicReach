import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import bgImage from "../assets/img3.webp";
import { AUTH_API_URL } from "../config";

export default function OtpVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your registered email";

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  const handleChange = async (index, e) => {
      const value = e.target.value.replace(/[^0-9]/g, "");
      
      const newOtp = [...otp];
      newOtp[index] = value ? value[value.length - 1] : "";
      setOtp(newOtp);
    
      // Next input par focus bhejna
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    
      
      const completeOtp = newOtp.join("");
      if (completeOtp.length === 6) {
        await RegisterOtpvirification(completeOtp);
      }
    };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isAuthority = location.state?.isAuthority || false;

  async function RegisterOtpvirification(otp){
    const url = `${AUTH_API_URL}/api/auth/verify-email`;

    try{
      const response = await fetch(url , {
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({
          "email":email,
          "otp":otp,
        }),
      });
      const result = await response.json();
    
        if (!response.ok) {
          setError(result.message || "Invalid or expired OTP");
          return;
        }
    
        // OTP Verify hone ke baad User ko Login ya Authority Login page par bhejna
        if (isAuthority) {
          navigate("/authority", { state: { email, verified: true } });
        } else {
          navigate("/login", { state: { email, verified: true } });
        }
    }catch(e){
      console.log("There is Any error in Reg Otp");
      setError("Server unreachable. Please check backend connection.");
    }finally{
      console.log("Request Gyi thi ek baar ");
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the full 6-digit OTP");
      return;
    }
    // OTP verified -> Route to Login page
   await RegisterOtpvirification(code);
  };

  const handleResend = () => {
    // TODO: hook up actual resend OTP API call
    setError("");
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden px-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-[#0A1120]/70" />

      <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        <div className="bg-[#111C31] border border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-9 shadow-2xl shadow-black/40">
          <div className="mb-6 text-center">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={22} className="text-teal-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-white">
              Verify OTP
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              We've sent a 6-digit code to {email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-11 h-12 sm:w-12 sm:h-14 text-center text-lg font-semibold bg-[#0B1526] border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-400/60 transition-colors"
                />
              ))}
            </div>

            {error && <p className="text-xs text-red-400 text-center -mt-3">{error}</p>}

            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-400 text-[#0A1120] font-semibold text-sm sm:text-base rounded-lg py-2.5 sm:py-3 transition-colors"
            >
              Verify
            </button>
          </form>

          {/* <p className="text-center text-xs sm:text-sm text-slate-500 mt-6">
            Didn't get the code?{" "}
            <button
              onClick={handleResend}
              type="button"
              className="text-teal-400 hover:text-teal-300"
            >
              Resend OTP
            </button>
          </p> */}
        </div>
      </div>
    </div>
  );
}
