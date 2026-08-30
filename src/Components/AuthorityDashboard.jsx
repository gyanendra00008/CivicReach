import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  User,
  LogOut,
  RefreshCw,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  X,
} from "lucide-react";
import bgImage from "../assets/img3.webp";
import { FASTAPI_API_URL } from "../config";

export default function AuthorityDashboard() {
  const navigate = useNavigate();

  const [authority, setAuthority] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Image Modal
  const [previewImage, setPreviewImage] = useState(null);

  // 1. Auth check
  useEffect(() => {
    const authStr = localStorage.getItem("authority");
    if (!authStr) {
      navigate("/authority", { replace: true });
      return;
    }

    try {
      const authData = JSON.parse(authStr);
      setAuthority(authData);
      fetchComplaints(authData.district, authData.category);
    } catch (e) {
      navigate("/authority", { replace: true });
    }
  }, [navigate]);

  // 2. Fetch Complaints for this District & Category
  async function fetchComplaints(district, category) {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (district && district.toLowerCase() !== "all" && district.toLowerCase() !== "all districts") {
        params.append("district", district);
      }
      if (
        category &&
        category.toLowerCase() !== "all" &&
        category.toLowerCase() !== "all categories"
      ) {
        params.append("category", category);
      }

      const url = `${FASTAPI_API_URL}/api/problems/authority?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to load complaints from database");
      }

      const data = await response.json();
      setProblems(data.problems || []);
    } catch (err) {
      console.error("Authority fetch error:", err);
      setError("Database se complaints fetch karne me dikkat hui. Make sure FastAPI backend is active.");
    } finally {
      setLoading(false);
    }
  }

  // 3. Update Status
  async function handleStatusChange(problemId, newStatus) {
    try {
      setUpdatingId(problemId);
      const response = await fetch(`${FASTAPI_API_URL}/api/problems/${problemId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update local state directly for instant feedback
      setProblems((prev) =>
        prev.map((p) => (p.id === problemId ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.error("Status update error:", err);
      alert("Status update nahi ho paya. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("authority");
    navigate("/authority");
  };

  const statusStyle = {
    pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    "in-review": "bg-sky-500/15 text-sky-300 border-sky-500/30",
    resolved: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  };

  const pendingCount = problems.filter((p) => (p.status || "pending").toLowerCase() === "pending").length;
  const reviewCount = problems.filter((p) => (p.status || "").toLowerCase() === "in-review").length;
  const resolvedCount = problems.filter((p) => (p.status || "").toLowerCase() === "resolved").length;

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex flex-col items-center px-3 sm:px-6 py-6 sm:py-10 relative overflow-x-hidden"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-[#0A1120]/85 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-6xl bg-[#111C31]/95 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-2xl flex flex-col gap-6 sm:gap-8">
        
        {/* Header: Authority Title + Officer Credentials + Logout */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <ShieldCheck size={16} />
              <span>Official Department Portal</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              {authority?.district ? `${authority.district} Authority` : "Authority Control Dashboard"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Assigned Department: <span className="text-white font-medium">{authority?.category || "General"}</span> • Officer: <span className="text-white font-medium">{authority?.fullName || "Officer"}</span>
            </p>
          </div>

          {/* Officer Profile Badge & Logout */}
          <div className="flex items-center gap-3 bg-[#0B1526] border border-white/10 px-3.5 py-2 rounded-xl self-stretch sm:self-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
                <ShieldCheck size={16} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-teal-400 font-semibold tracking-wider uppercase">ID: {authority?.authorityId || "AUTH-01"}</span>
                <span className="text-xs sm:text-sm text-white font-medium truncate max-w-[180px]">
                  {authority?.officialEmail || "authority@gov.in"}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2.5 py-1.5 rounded-lg transition-colors border border-rose-500/20 shrink-0"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-amber-300 text-3xl sm:text-4xl font-extrabold">{pendingCount}</span>
              <span className="text-slate-300 text-sm sm:text-base font-medium mt-1">Pending Action</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Clock size={22} />
            </div>
          </div>

          <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sky-300 text-3xl sm:text-4xl font-extrabold">{reviewCount}</span>
              <span className="text-slate-300 text-sm sm:text-base font-medium mt-1">Under Investigation</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center">
              <AlertTriangle size={22} />
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-emerald-300 text-3xl sm:text-4xl font-extrabold">{resolvedCount}</span>
              <span className="text-slate-300 text-sm sm:text-base font-medium mt-1">Resolved Issues</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>

        {/* Complaints List / Table */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-base sm:text-lg font-semibold text-white">
                Routed Complaints ({problems.length})
              </h3>
              <span className="text-xs text-teal-400 font-medium bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full">
                {authority?.category || "General"} • {authority?.district || "All Districts"}
              </span>
            </div>

            <button
              onClick={() => fetchComplaints(authority?.district, authority?.category)}
              disabled={loading}
              className="bg-[#0B1526] hover:bg-white/5 border border-white/10 text-slate-300 px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium transition-colors self-start sm:self-auto"
            >
              <RefreshCw size={15} className={loading ? "animate-spin text-teal-400" : ""} />
              <span>Refresh Complaints</span>
            </button>
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-sm mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <RefreshCw size={32} className="animate-spin text-teal-400" />
              <p className="text-sm">Complaints load ho rahi hain...</p>
            </div>
          ) : problems.length === 0 ? (
            <div className="bg-[#0B1526]/50 border border-dashed border-white/10 rounded-2xl py-12 px-4 flex flex-col items-center justify-center text-center">
              <CheckCircle2 size={32} className="text-emerald-400 mb-2" />
              <p className="text-base sm:text-lg font-medium text-white">Koi complaint pending nahi hai</p>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Is district aur category ke liye sabhi complaints resolved ya clear hain.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {problems.map((p, idx) => {
                const normStatus = (p.status || "pending").toLowerCase();
                const isUpdating = updatingId === p.id;

                return (
                  <div
                    key={p.id || idx}
                    className="bg-[#0B1526] hover:bg-[#0E1B31] border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col gap-4 transition-all"
                  >
                    {/* Top Row: Title, Category, Pincode & Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                            #{p.id || `C-${idx + 1}`}
                          </span>
                          <h4 className="font-bold text-white text-base sm:text-lg truncate">
                            {p.title}
                          </h4>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 mt-1.5">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-medium">
                            {p.category}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-300">
                            <MapPin size={13} className="text-rose-400" />
                            {p.district || "District"}, Pincode: <strong className="text-white">{p.pincode}</strong>
                          </span>
                          <span>•</span>
                          <span>Citizen: <strong className="text-slate-300">{p.user_email}</strong></span>
                        </div>
                      </div>

                      {/* Current Status Badge */}
                      <span
                        className={`text-xs px-3.5 py-1.5 rounded-full border font-bold capitalize self-start sm:self-auto shrink-0 ${
                          statusStyle[normStatus] || statusStyle.pending
                        }`}
                      >
                        {p.status || "Pending"}
                      </span>
                    </div>

                    {/* Description */}
                    {p.description && (
                      <p className="text-xs sm:text-sm text-slate-300 bg-[#111C31] rounded-xl p-3.5 leading-relaxed border border-white/5">
                        {p.description}
                      </p>
                    )}

                    {/* Bottom Row: Photo Preview + Quick Status Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
                      {/* Photo preview link */}
                      {p.img_url ? (
                        <button
                          onClick={() => setPreviewImage(p.img_url)}
                          className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 transition-colors self-start"
                        >
                          <Eye size={14} />
                          <span>View Evidence / Photo</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500">No Photo Attached</span>
                      )}

                      {/* Authority Status Changer Buttons */}
                      <div className="flex items-center gap-2 self-stretch sm:self-auto">
                        <span className="text-xs text-slate-400 font-medium mr-1">Update Status:</span>

                        <button
                          onClick={() => handleStatusChange(p.id, "pending")}
                          disabled={isUpdating || normStatus === "pending"}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                            normStatus === "pending"
                              ? "bg-amber-500 text-slate-950"
                              : "bg-white/5 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20"
                          } disabled:opacity-50`}
                        >
                          Pending
                        </button>

                        <button
                          onClick={() => handleStatusChange(p.id, "in-review")}
                          disabled={isUpdating || normStatus === "in-review"}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                            normStatus === "in-review"
                              ? "bg-sky-500 text-slate-950"
                              : "bg-white/5 hover:bg-sky-500/20 text-sky-300 border border-sky-500/20"
                          } disabled:opacity-50`}
                        >
                          In Review
                        </button>

                        <button
                          onClick={() => handleStatusChange(p.id, "resolved")}
                          disabled={isUpdating || normStatus === "resolved"}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                            normStatus === "resolved"
                              ? "bg-emerald-500 text-slate-950"
                              : "bg-white/5 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20"
                          } disabled:opacity-50`}
                        >
                          Resolved ✓
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Modal for Viewing Full Photo */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-[#111C31] border border-white/10 rounded-2xl p-4 overflow-hidden">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>
            <h4 className="text-sm font-semibold text-white mb-3">Attached Photo / Evidence</h4>
            <div className="max-h-[75vh] overflow-auto rounded-xl flex items-center justify-center bg-black/50 p-2">
              <img
                src={previewImage}
                alt="Complaint Evidence"
                className="max-h-[65vh] max-w-full rounded-lg object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
