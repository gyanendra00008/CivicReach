import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import bgImage from "../assets/img3.webp";
import { AUTH_API_URL } from "../config";

export default function LoginOtpVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your registered email";

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (index, e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (!value) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }
    const newOtp = [...otp];
    newOtp[index] = value[value.length - 1];
    setOtp(newOtp);
    if (index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  async function LoginOtpVerification(otpCode) {
    const url = `${AUTH_API_URL}/api/auth/verify-login`;
    try {
      setLoading(true);
      setError("");
      const response = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email,
          otp: otpCode,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Invalid or expired OTP");
        return;
      }

      // Store tokens / user info
      if (result.accessToken) {
        localStorage.setItem("accessToken", result.accessToken);
      }
      const verifiedUser = result.user || { email: email };
      localStorage.setItem("user", JSON.stringify(verifiedUser));

      // Route to User Dashboard on successful verification
      navigate("/user-dashboard", { state: { email: verifiedUser.email, user: verifiedUser } });
    } catch (e) {
      console.error("Error verifying login OTP:", e);
      setError("Server unreachable. Please make sure backend is running.");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the full 6-digit OTP");
      return;
    }
    await LoginOtpVerification(code);
  };

  const handleResend = () => {
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
              Verify Login OTP
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              We've sent a 6-digit login code to {email}
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
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-400 text-[#0A1120] font-semibold text-sm sm:text-base rounded-lg py-2.5 sm:py-3 transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </form>

          <p className="text-center text-xs sm:text-sm text-slate-500 mt-6">
            Didn't get the code?{" "}
            <button
              onClick={handleResend}
              type="button"
              className="text-teal-400 hover:text-teal-300"
            >
              Resend OTP
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
