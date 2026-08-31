import React, { useState, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import bgImage from "../assets/img3.webp";
import { AUTH_API_URL } from "../config";

export default function LoginOtpVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAuthority = location.state?.isAuthority || false;
  const authorityData = location.state?.authorityData || null;
  const email = location.state?.email || (isAuthority ? "your official email" : "your registered email");

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = async (index, e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = value ? value[value.length - 1] : "";
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const code = newOtp.join("");
    if (code.length === 6) {
      await LoginOtpVerification(code);
    }
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
      setSuccessMsg("");

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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

      // Store tokens if present
      if (result.accessToken) {
        localStorage.setItem("accessToken", result.accessToken);
      }

      if (isAuthority) {
        // Build and save authority session in localStorage only AFTER successful OTP verification
        const verifiedUser = result.user || {};
        const authoritySession = {
          fullName: verifiedUser.username || authorityData?.fullName || email.split("@")[0] || "Officer",
          officialEmail: email,
          category: authorityData?.category || verifiedUser.category || "Electricity",
          district: authorityData?.district || verifiedUser.district || "South West Delhi",
          authorityId: authorityData?.authorityId || verifiedUser.authorityId || `AUTH-${Math.floor(1000 + Math.random() * 9000)}`,
        };

        localStorage.setItem("authority", JSON.stringify(authoritySession));
        navigate("/authority-dashboard", { replace: true });
      } else {
        // Route to User Dashboard on successful user verification
        const verifiedUser = result.user || { email: email };
        localStorage.setItem("user", JSON.stringify(verifiedUser));
        navigate("/user-dashboard", { state: { email: verifiedUser.email, user: verifiedUser }, replace: true });
      }
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

  const handleResend = async () => {
    setError("");
    setSuccessMsg("");
    try {
      setResending(true);
      // Inform the user or trigger resend
      setSuccessMsg("If your account is active, a new OTP has been dispatched to your email.");
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden px-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-[#0A1120]/75 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        <div className="bg-[#111C31] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-9 shadow-2xl shadow-black/50">
          <div className="mb-6 text-center">
            <div className="w-12 h-12 rounded-full bg-teal-500/15 text-teal-400 flex items-center justify-center mx-auto mb-3 border border-teal-500/20">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {isAuthority ? "Authority OTP Verification" : "Verify Login OTP"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              We've sent a 6-digit verification code to <br />
              <span className="text-teal-400 font-medium">{email}</span>
            </p>
            {isAuthority && authorityData?.district && (
              <p className="text-[11px] text-slate-400 mt-2 bg-white/5 py-1 px-2.5 rounded-lg inline-block border border-white/10">
                Jurisdiction: <span className="text-white">{authorityData.district}</span> ({authorityData.category})
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex justify-between gap-1.5 sm:gap-2">
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
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold bg-[#0B1526] border border-white/10 rounded-xl text-white focus:outline-none focus:border-teal-400/80 transition-colors"
                />
              ))}
            </div>

            {error && (
              <p className="text-xs text-red-400 text-center bg-red-500/10 border border-red-500/20 py-2 px-3 rounded-lg -mt-1">
                {error}
              </p>
            )}

            {successMsg && (
              <p className="text-xs text-teal-400 text-center bg-teal-500/10 border border-teal-500/20 py-2 px-3 rounded-lg -mt-1">
                {successMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm sm:text-base rounded-xl py-3 transition-colors shadow-lg shadow-teal-500/10 disabled:opacity-50"
            >
              {loading
                ? "Verifying..."
                : isAuthority
                ? "Verify & Enter Authority Dashboard"
                : "Verify & Sign In"}
            </button>
          </form>

          <div className="flex items-center justify-between mt-6 text-xs text-slate-500 border-t border-white/10 pt-4">
            <Link
              to={isAuthority ? "/authority" : "/login"}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Back to Login</span>
            </Link>

            <button
              onClick={handleResend}
              disabled={resending}
              type="button"
              className="text-teal-400 hover:text-teal-300 font-medium"
            >
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
