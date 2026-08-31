import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, User, Mail, Lock, IdCard, MapPin, Eye, EyeOff, Tag } from "lucide-react";
import bgImage from "../assets/img3.webp";
import { AUTH_API_URL } from "../config";

function Field({ icon, label, type, placeholder, value, onChange, error, endAdornment }) {
  return (
    <div>
      <label className="text-xs sm:text-sm font-medium text-slate-400 mb-1.5 block">{label}</label>
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

const CATEGORIES = [
  "Electricity",
  "Water supply",
  "Road & infrastructure",
  "Sanitation",
  "Traffic",
  "Public health",
  "Public safety",
  "Animal control",
];

export default function AuthoritySignup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    officialEmail: "",
    password: "",
    authorityId: "",
    category: "Electricity",
    district: "South West Delhi",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.officialEmail.trim()) newErrors.officialEmail = "Official email is required";
    if (!form.password.trim() || form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!form.authorityId.trim()) newErrors.authorityId = "Authority ID is required";
    if (!form.district.trim()) newErrors.district = "District is required";
    return newErrors;
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      setApiError("");

      const url = `${AUTH_API_URL}/api/auth/register`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.fullName.trim(),
          email: form.officialEmail.trim(),
          password: form.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setApiError(result.message || "Failed to register authority account. Please try again.");
      } else {
        navigate("/verify-otp", {
          state: {
            email: form.officialEmail.trim(),
            isAuthority: true,
          },
        });
      }
    } catch (e) {
      console.error("Authority registration error:", e);
      setApiError("Server is unreachable. Please make sure the authentication backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      await handleRegister();
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
            <h1 className="text-xl sm:text-2xl font-bold text-white">Authority Signup</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Create an official account to manage routed complaints
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Field
              icon={<User size={16} />}
              label="Officer Full Name"
              type="text"
              placeholder="e.g. Ramesh Kumar"
              value={form.fullName}
              onChange={handleChange("fullName")}
              error={errors.fullName}
            />

            <Field
              icon={<Mail size={16} />}
              label="Official Email"
              type="email"
              placeholder="officer@pwd.gov.in"
              value={form.officialEmail}
              onChange={handleChange("officialEmail")}
              error={errors.officialEmail}
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

            <Field
              icon={<IdCard size={16} />}
              label="Official Employee ID"
              type="text"
              placeholder="AUTH-9872"
              value={form.authorityId}
              onChange={handleChange("authorityId")}
              error={errors.authorityId}
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
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#111C31] text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Field
                icon={<MapPin size={16} />}
                label="District"
                type="text"
                placeholder="South West Delhi"
                value={form.district}
                onChange={handleChange("district")}
                error={errors.district}
              />
            </div>

            <p className="text-[11px] text-teal-400/80 bg-teal-500/10 p-2.5 rounded-lg border border-teal-500/20">
              📌 The Problems will be Automatically Route in your DashBoard according to your district and Category
            </p>

            {apiError && (
              <p className="text-xs text-red-400 text-center bg-red-500/10 border border-red-500/20 py-2 px-3 rounded-lg">
                {apiError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm sm:text-base rounded-xl py-3 transition-colors shadow-lg shadow-teal-500/10 disabled:opacity-50"
            >
              {loading ? "Registering & Sending OTP..." : "Create Account & Verify OTP"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-4">
            Already have an account?{" "}
            <Link to="/authority" className="text-teal-400 hover:text-teal-300">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
