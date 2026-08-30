import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import bgImage from "../assets/img3.webp";
import { AUTH_API_URL } from "../config";

function Field({ icon, label, type, placeholder, value, onChange, error, endAdornment }) {
  return (
    <div>
      <label className="text-sm sm:text-base font-medium text-slate-400 mb-1.5 sm:mb-2 block">{label}</label>
      <div
        className={`flex items-center gap-2 bg-[#0B1526] border rounded-lg px-3 sm:px-4 py-3 sm:py-3.5 transition-colors ${
          error ? "border-red-500/60" : "border-white/5 focus-within:border-teal-400/60"
        }`}
      >
        <span className="text-slate-500">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm sm:text-base text-white placeholder:text-slate-600"
        />
        {endAdornment}
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

export default function UserSignup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    // if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.password.trim() || form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!agreed) newErrors.agreed = "Please accept the terms to continue";
    return newErrors;
  };

  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length !== 0) {
      return;
    }
    await Register();
  };

  async function Register() {
    const username = form.fullName.trim();
    const email = form.email.trim();
    const password = form.password;

    try {
      setLoading(true);
      setApiError("");
      const url = `${AUTH_API_URL}/api/auth/register`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setApiError(result.message || "Failed to register. Please try again.");
      } else {
        navigate("/verify-otp", { state: { email: email } });
      }
    } catch (e) {
      console.error(e);
      setApiError("Server is unreachable. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden px-4 py-8 sm:py-10 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-[#0A1120]/70" />

      <div className="relative z-10 w-full max-w-sm sm:max-w-lg">
        <div className="bg-[#111C31] border border-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-9 shadow-2xl shadow-black/40">
          <div className="mb-5 sm:mb-7 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2.5 sm:mb-3">
              <User size={20} className="text-teal-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-white">Create your account</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Please Register Before Complaint
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
            <Field
              icon={<User size={18} />}
              label="Full name"
              type="text"
              placeholder="Priya Sharma"
              value={form.fullName}
              onChange={handleChange("fullName")}
              error={errors.fullName}
            />

            <Field
              icon={<Mail size={18} />}
              label="Email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange("email")}
              error={errors.email}
            />

            {/* <Field
              icon={<Phone size={18} />}
              label="Phone number"
              type="tel"
              placeholder="98765 43210"
              value={form.phone}
              onChange={handleChange("phone")}
              error={errors.phone}
            /> */}

            <Field
              icon={<Lock size={18} />}
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              value={form.password}
              onChange={handleChange("password")}
              error={errors.password}
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

            <div>
              <label className="flex items-start gap-2 text-xs sm:text-sm text-slate-400">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5"
                />
                i am agree with Your privacy policies
              </label>
              {errors.agreed && (
                <p className="text-xs text-red-400 mt-1">{errors.agreed}</p>
              )}
            </div>

            {apiError && (
              <p className="text-xs text-red-400 text-center">{apiError}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-400 text-[#0A1120] font-semibold text-sm sm:text-base rounded-lg py-2.5 sm:py-3 transition-colors disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-xs sm:text-sm text-slate-500 mt-5 sm:mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-teal-400 hover:text-teal-300">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}