import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { KeyRound, Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import bgImage from "../assets/img3.webp";
import { AUTH_API_URL } from "../config";

function Field({ icon, label, type, placeholder, value, onChange, error, endAdornment, disabled }) {
  return (
    <div>
      <label className="text-sm sm:text-base font-medium text-slate-400 mb-1.5 sm:mb-2 block">{label}</label>
      <div
        className={`flex items-center gap-2 bg-[#0B1526] border rounded-lg px-3 sm:px-4 py-3 sm:py-3.5 transition-colors ${
          error ? "border-red-500/60" : "border-white/5 focus-within:border-teal-400/60"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <span className="text-slate-500">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm sm:text-base text-white placeholder:text-slate-600 disabled:cursor-not-allowed"
        />
        {endAdornment}
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

export default function UserForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    let timer;
    if (isSuccess && countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    } else if (isSuccess && countdown === 0) {
      navigate("/login", { state: { email } });
    }
    return () => clearTimeout(timer);
  }, [isSuccess, countdown, navigate, email]);

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!emailRegex.test(email.trim())) {
      errs.email = "Please enter a valid email address";
    }

    if (!newPassword) {
      errs.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      errs.newPassword = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      errs.confirmPassword = "Confirm password is required";
    } else if (newPassword !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    return errs;
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setApiError("");
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      const url = `${AUTH_API_URL}/api/auth/reset-password`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setApiError(result.message || "Failed to reset password. Please try again.");
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      console.error("Password reset error:", err);
      setApiError("Server is unreachable. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden px-4 py-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-[#0A1120]/70 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-sm sm:max-w-lg">
        <div className="bg-[#111C31] border border-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-9 shadow-2xl shadow-black/40">
          {/* Header */}
          <div className="mb-5 sm:mb-7 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-2.5 sm:mb-3">
              <KeyRound size={22} className="text-teal-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-white">Reset User Password</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Enter your registered email and choose a new password
            </p>
          </div>

          {isSuccess ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-teal-500/15 border border-teal-500/30 rounded-full flex items-center justify-center mx-auto text-teal-400">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Password Reset Successful!</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5">
                  Your password has been updated successfully.
                </p>
                <p className="text-xs text-teal-400/90 mt-2 font-medium">
                  Redirecting to login in <span className="font-bold text-white text-sm">{countdown}s</span>...
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/login", { state: { email } })}
                  className="w-full bg-teal-500 hover:bg-teal-400 text-[#0A1120] font-semibold text-sm sm:text-base rounded-lg py-2.5 sm:py-3 transition-colors"
                >
                  Proceed to Login Now
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4 sm:space-y-5" noValidate>
              <Field
                icon={<Mail size={18} />}
                label="Registered Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                }}
                error={errors.email}
                disabled={loading}
              />

              <Field
                icon={<Lock size={18} />}
                label="New Password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: null }));
                }}
                error={errors.newPassword}
                disabled={loading}
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              <Field
                icon={<Lock size={18} />}
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
                }}
                error={errors.confirmPassword}
                disabled={loading}
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="text-slate-500 hover:text-slate-300"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              {apiError && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/25 rounded-lg text-xs sm:text-sm text-red-400">
                  <AlertCircle size={16} className="shrink-0 text-red-400" />
                  <span>{apiError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-500 hover:bg-teal-400 text-[#0A1120] font-semibold text-sm sm:text-base rounded-lg py-2.5 sm:py-3 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <span>Reset Password</span>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 border-t border-white/5 pt-4 text-center space-y-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-teal-400 hover:text-teal-300 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to User Login</span>
            </Link>

            <p className="text-xs text-slate-500">
              Are you an official?{" "}
              <Link to="/authority/forgotPass" className="text-teal-400 hover:text-teal-300">
                Authority Password Reset
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}