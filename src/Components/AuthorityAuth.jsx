import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import bgImage from "../assets/img3.webp";

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

export default function AuthorityAuth() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password.trim()) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // TODO: hook up actual auth call
      navigate("/");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden px-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-[#0A1120]/70" />

      <div className="relative z-10 w-full max-w-sm sm:max-w-lg">
        <div className="bg-[#111C31] border border-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-9 shadow-2xl shadow-black/40">
          <div className="mb-5 sm:mb-7 text-center">
            <h1 className="text-xl sm:text-2xl font-semibold text-white flex items-center justify-center gap-2">
              <ShieldCheck size={20} className="text-teal-400" />
              Authority Login
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Sign in with your authority credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
            <Field
              icon={<Mail size={18} />}
              label="Email"
              type="email"
              placeholder="authority@example.com"
              value={form.email}
              onChange={handleChange("email")}
              error={errors.email}
            />

            <Field
              icon={<Lock size={18} />}
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
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
              <div className="flex justify-end -mt-1">
    <Link to="/authority/forgotPass" 
      className="text-xs sm:text-sm text-teal-400 hover:text-teal-300 hover:underline"
    >
      Forgot Password?
    </Link>
  </div>
            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-400 text-[#0A1120] font-semibold text-sm sm:text-base rounded-lg py-2.5 sm:py-3 transition-colors"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-xs sm:text-sm text-slate-500 mt-5 sm:mt-6">
            Not an authority?{" "}
            <Link to="/login" className="text-teal-400 hover:text-teal-300">
              User login
            </Link>
          </p>
          <p className="text-center text-xs sm:text-sm text-slate-500 mt-2">
            Need an authority account?{" "}
            <Link to="/authority-signup" className="text-teal-400 hover:text-teal-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}