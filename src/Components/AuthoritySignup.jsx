import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, User, Mail, Lock, IdCard, MapPin, Eye, EyeOff } from "lucide-react";
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

const CATEGORIES = ["Water", "Electricity", "Roads", "Sanitation", "Health", "Other"];

export default function AuthoritySignup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    officialEmail: "",
    password: "",
    authorityId: "",
    category: "Water",
    district: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.officialEmail.trim()) newErrors.officialEmail = "Official email is required";
    if (!form.password.trim() || form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!form.authorityId.trim()) newErrors.authorityId = "Authority ID is required";
    if (!form.district.trim()) newErrors.district = "District is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      navigate("/authority");
    }
  };

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
              <ShieldCheck size={20} className="text-teal-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-white">Authority signup</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Apna official account banao complaints handle karne ke liye
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
            <Field
              icon={<User size={18} />}
              label="Full name"
              type="text"
              placeholder="Ramesh Kumar"
              value={form.fullName}
              onChange={handleChange("fullName")}
              error={errors.fullName}
            />

            <Field
              icon={<Mail size={18} />}
              label="Official email"
              type="email"
              placeholder="name@department.gov.in"
              value={form.officialEmail}
              onChange={handleChange("officialEmail")}
              error={errors.officialEmail}
            />

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

            <Field
              icon={<IdCard size={18} />}
              label="Authority ID"
              type="text"
              placeholder="Employee or department ID"
              value={form.authorityId}
              onChange={handleChange("authorityId")}
              error={errors.authorityId}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm sm:text-base font-medium text-slate-400 mb-1.5 sm:mb-2 block">Category</label>
                <div className="bg-[#0B1526] border border-white/5 rounded-lg px-3 sm:px-4 py-3 sm:py-3.5 focus-within:border-teal-400/60">
                  <select
                    value={form.category}
                    onChange={handleChange("category")}
                    className="w-full bg-transparent outline-none text-sm sm:text-base text-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#0B1526] text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Field
                icon={<MapPin size={18} />}
                label="District"
                type="text"
                placeholder="e.g. Central Delhi"
                value={form.district}
                onChange={handleChange("district")}
                error={errors.district}
              />
            </div>

            <p className="text-xs text-slate-500">
              Category aur district se basis pe hi complaints tumhare dashboard mein fetch honge.
            </p>

            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-400 text-[#0A1120] font-semibold text-sm sm:text-base rounded-lg py-2.5 sm:py-3 transition-colors"
            >
              Create account
            </button>
          </form>

          <p className="text-center text-xs sm:text-sm text-slate-500 mt-5 sm:mt-6">
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