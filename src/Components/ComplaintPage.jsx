import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, LogOut, RefreshCw, PlusCircle, AlertCircle, Clock, CheckCircle2, AlertTriangle, MapPin } from "lucide-react";
import bgImage from "../assets/img3.webp";
import { FASTAPI_API_URL, AUTH_API_URL } from "../config";
import { authFetch, logoutUser } from "../Utilities/auth";

function daysAgo(dateStr) {
  if (!dateStr) return "Recently";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  if (isNaN(diffMs) || diffMs < 0) return "Recently";
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Aaj (Today)";
  if (days === 1) return "1 din pehle";
  if (days < 7) return `${days} din pehle`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "1 hafta pehle" : `${weeks} hafte pehle`;
}

function ComplaintPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // 1. Authentication Check & User details initialization
  useEffect(() => {
    let isMounted = true;

    async function verifySession() {
      const token = localStorage.getItem("accessToken");
      const storedUserStr = localStorage.getItem("user");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await authFetch(`${AUTH_API_URL}/api/auth/getme`);
        if (response.ok) {
          const result = await response.json();
          if (isMounted) {
            const userObj = {
              username: result.username,
              email: result.email,
            };
            localStorage.setItem("user", JSON.stringify(userObj));
            setUser(userObj);
            fetchUserProblems(userObj.email);
          }
        } else {
          if (isMounted) {
            navigate("/login", { replace: true });
          }
        }
      } catch (err) {
        console.error("Session verification failed:", err);
        if (storedUserStr) {
          try {
            const localUser = JSON.parse(storedUserStr);
            if (isMounted) {
              setUser(localUser);
              fetchUserProblems(localUser.email);
            }
          } catch (e) {
            if (isMounted) navigate("/login", { replace: true });
          }
        } else {
          if (isMounted) navigate("/login", { replace: true });
        }
      }
    }

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // 2. Fetch User's Problems from FastAPI Backend
  async function fetchUserProblems(userEmail) {
    if (!userEmail) return;
    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `${FASTAPI_API_URL}/api/problems/user/${encodeURIComponent(userEmail.trim())}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch problems from database");
      }

      const data = await response.json();
      setComplaints(data.problems || []);
    } catch (err) {
      console.error("Error fetching user problems:", err);
      setError("Database se problems load karne me dikkat hui. Make sure FastAPI backend is running.");
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const statusStyle = {
    pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    "in-review": "bg-sky-500/15 text-sky-300 border-sky-500/30",
    resolved: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  };

  const statusLabel = {
    pending: "Pending",
    "in-review": "In Review",
    resolved: "Resolved",
  };

  const pendingCount = complaints.filter(
    (c) => (c.status || "pending").toLowerCase() === "pending"
  ).length;
  const reviewCount = complaints.filter(
    (c) => (c.status || "").toLowerCase() === "in-review"
  ).length;
  const resolvedCount = complaints.filter(
    (c) => (c.status || "").toLowerCase() === "resolved"
  ).length;

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex flex-col items-center px-3 sm:px-6 py-6 sm:py-10 relative overflow-x-hidden"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[#0A1120]/80 backdrop-blur-sm" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl bg-[#111C31]/95 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-2xl flex flex-col gap-6 sm:gap-8">
        
        {/* Top Header: Welcome + User Email in Corner + Logout */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
              <span>Citizen Dashboard</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Aapki submit ki gayi saari complaints aur live status
            </p>
          </div>

          {/* User Email Display in Corner */}
          <div className="flex items-center gap-3 bg-[#0B1526] border border-white/10 px-3.5 py-2 rounded-xl self-stretch sm:self-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
                <User size={16} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-teal-400 font-semibold tracking-wider uppercase">Logged In As</span>
                <span className="text-xs sm:text-sm text-white font-medium truncate max-w-[180px] sm:max-w-[220px]">
                  {user?.email || "Loading..."}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
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
              <span className="text-slate-300 text-sm sm:text-base font-medium mt-1">Pending</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Clock size={22} />
            </div>
          </div>

          <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sky-300 text-3xl sm:text-4xl font-extrabold">{reviewCount}</span>
              <span className="text-slate-300 text-sm sm:text-base font-medium mt-1">In Review</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center">
              <AlertTriangle size={22} />
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-emerald-300 text-3xl sm:text-4xl font-extrabold">{resolvedCount}</span>
              <span className="text-slate-300 text-sm sm:text-base font-medium mt-1">Resolved</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>

        {/* Action Header: New Complaint Button + Refresh */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            onClick={() => navigate("/complaints/new")}
            className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-base sm:text-lg py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-500/10 transition-all hover:scale-[1.01]"
          >
            <PlusCircle size={20} />
            <span>+ Report New Complaint</span>
          </button>

          <button
            onClick={() => fetchUserProblems(user?.email)}
            disabled={loading}
            className="bg-[#0B1526] hover:bg-white/5 border border-white/10 text-slate-300 px-4 py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors"
          >
            <RefreshCw size={16} className={loading ? "animate-spin text-teal-400" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Problems List Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-white">
              Aapki Complaints ({complaints.length})
            </h3>
            <span className="text-xs text-slate-400">Database Sync: Active</span>
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-sm flex items-center gap-2.5 mb-4">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <RefreshCw size={32} className="animate-spin text-teal-400" />
              <p className="text-sm">Database se problems load ho rahi hain...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="bg-[#0B1526]/50 border border-dashed border-white/10 rounded-2xl py-12 px-4 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center mb-3">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-base sm:text-lg font-medium text-white">Abhi tak koi problem darj nahi ki gayi hai</p>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm">
                Apne area ki kisi bhi samasya (Road, Electricity, Water) ko report karne ke liye 'Report New Complaint' par click karein.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {complaints.map((c, index) => {
                const normStatus = (c.status || "pending").toLowerCase();
                return (
                  <div
                    key={c.id || index}
                    className="bg-[#0B1526] hover:bg-[#0E1B31] border border-white/5 hover:border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col gap-3 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex flex-col min-w-0">
                        <h4 className="font-semibold text-white text-base sm:text-lg truncate">
                          {c.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-400 mt-1">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-300 font-medium">
                            {c.category}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-teal-400" />
                            Pincode: {c.pincode}
                          </span>
                          <span>•</span>
                          <span>{daysAgo(c.createdAt)}</span>
                        </div>
                      </div>

                      <span
                        className={`text-xs sm:text-sm px-3.5 py-1.5 rounded-full border font-semibold self-start sm:self-auto shrink-0 ${
                          statusStyle[normStatus] || statusStyle.pending
                        }`}
                      >
                        {statusLabel[normStatus] || c.status || "Pending"}
                      </span>
                    </div>

                    {c.description && (
                      <p className="text-xs sm:text-sm text-slate-300 bg-white/5 rounded-lg p-3 leading-relaxed border border-white/5">
                        {c.description}
                      </p>
                    )}

                    {c.img_url && c.img_url.startsWith("http") && (
                      <div className="mt-1">
                        <a
                          href={c.img_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-teal-400 hover:underline flex items-center gap-1"
                        >
                          📷 View Attached Photo
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ComplaintPage;
