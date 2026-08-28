import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, MapPin, Tag } from "lucide-react";
import bgImage from "../assets/img3.webp";

const CATEGORIES = [
  "All Categories",
  "Electricity",
  "Water supply",
  "Road & infrastructure",
  "Sanitation",
  "Traffic",
  "Public health",
  "Public safety",
  "Animal control",
];

function Field({ icon, label, type, placeholder, value, onChange, error, endAdornment }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-400 mb-1.5 block">{label}</label>
      <div
        className={`flex items-center gap-2 bg-[#0B1526] border rounded-xl px-3.5 py-3 transition-colors ${
          error ? "border-red-500/60" : "border-white/10 focus-within:border-teal-400/60"
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
  const [form, setForm] = useState({
    email: "",
    password: "",
    category: "Electricity",
    district: "South West Delhi",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Official Email is required";
    if (!form.password.trim()) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const authoritySession = {
        fullName: form.email.split("@")[0] || "Officer",
        officialEmail: form.email.trim(),
        category: form.category,
        district: form.district.trim(),
        authorityId: `AUTH-${Math.floor(1000 + Math.random() * 9000)}`,
      };

      localStorage.setItem("authority", JSON.stringify(authoritySession));
      navigate("/authority-dashboard");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden px-4 py-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-[#0A1120]/75 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-sm sm:max-w-md my-4">
        <div className="bg-[#111C31] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-9 shadow-2xl shadow-black/50">
          <div className="mb-5 text-center">
            <div className="w-12 h-12 rounded-full bg-teal-500/15 text-teal-400 flex items-center justify-center mx-auto mb-2.5 border border-teal-500/20">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Authority Login</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Official portal to manage citizen complaints</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Field
              icon={<Mail size={16} />}
              label="Official Email"
              type="email"
              placeholder="officer@pwd.delhi.gov.in"
              value={form.email}
              onChange={handleChange("email")}
              error={errors.email}
            />

            <Field
              icon={<Lock size={16} />}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs sm:text-sm font-medium text-slate-400 mb-1.5 block">Department</label>
                <div className="flex items-center gap-2 bg-[#0B1526] border border-white/10 rounded-xl px-3 py-2.5">
                  <Tag size={14} className="text-teal-400 shrink-0" />
                  <select
                    value={form.category}
                    onChange={handleChange("category")}
                    className="w-full bg-transparent outline-none text-xs sm:text-sm text-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-[#111C31] text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-medium text-slate-400 mb-1.5 block">District Jurisdiction</label>
                <div className="flex items-center gap-2 bg-[#0B1526] border border-white/10 rounded-xl px-3 py-2.5">
                  <MapPin size={14} className="text-rose-400 shrink-0" />
                  <input
                    type="text"
                    value={form.district}
                    onChange={handleChange("district")}
                    placeholder="e.g. South West Delhi"
                    className="w-full bg-transparent outline-none text-xs sm:text-sm text-white placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end -mt-1">
              <Link
                to="/authority/forgotPass"
                className="text-xs text-teal-400 hover:text-teal-300 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm sm:text-base rounded-xl py-3 transition-colors shadow-lg shadow-teal-500/10 mt-2"
            >
              Sign In to Authority Dashboard
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-5">
            Not an authority?{" "}
            <Link to="/login" className="text-teal-400 hover:text-teal-300">
              User login
            </Link>
          </p>
          <p className="text-center text-xs text-slate-500 mt-1.5">
            Need an authority account?{" "}
            <Link to="/authority-signup" className="text-teal-400 hover:text-teal-300">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
