import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import bgImage from "../assets/img3.webp";

export default function UserForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // For demo purposes - add your backend logic here
    alert(`Password reset successful for ${email}!`);
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#06152a]">
      {/* Background - Same as your User Login */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="bg"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#06152a]/90 via-[#0a2a5a]/80 to-[#06152a]/90"></div>
      </div>

      {/* Card - Same as your screenshot */}
      <div className="relative z-10 w-full max-w-[420px] mx-4">
        <div className="bg-[#0c1e3a]/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-8 shadow-2xl">

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-white text-[22px] font-semibold flex items-center justify-center gap-2">
              <ShieldCheck className="text-cyan-400" size={24} /> User Password Reset
            </h2>
            <p className="text-blue-300/70 text-[13px] mt-1">
              Reset your Password
            </p>
          </div>

          <form onSubmit={handleReset} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-white/80 text-[13px] mb-1.5 block">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400/70">✉️</span>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#132a4e]/80 border border-blue-500/10 rounded-lg pl-10 pr-4 py-2.5 text-white text-[14px] placeholder:text-blue-300/40 outline-none focus:border-cyan-400/50"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="text-white/80 text-[13px] mb-1.5 block">New Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400/70">🔒</span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#132a4e]/80 border border-blue-500/10 rounded-lg pl-10 pr-4 py-2.5 text-white text-[14px] placeholder:text-blue-300/40 outline-none focus:border-cyan-400/50"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-white/80 text-[13px] mb-1.5 block">Confirm New Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400/70">🔒</span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#132a4e]/80 border border-blue-500/10 rounded-lg pl-10 pr-4 py-2.5 text-white text-[14px] placeholder:text-blue-300/40 outline-none focus:border-cyan-400/50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-400 to-teal-300 text-[#06152a] font-semibold py-2.5 rounded-lg text-[15px] hover:opacity-90 transition-all mt-2"
            >
              Update Password
            </button>
          </form>

          <div className="text-center mt-6 space-y-2">
            <Link to="/login" className="block text-[12px] text-cyan-300/80 hover:text-cyan-300">
              ← Back to User Login
            </Link>
            <p className="text-[11px] text-blue-300/50">
              Not a user? <Link to="/authority" className="text-cyan-300/70">Authority login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}