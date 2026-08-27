import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/img3.webp";

function daysAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Aaj";
  if (days === 1) return "1 din pehle";
  if (days < 7) return `${days} din pehle`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "1 hafta pehle" : `${weeks} hafte pehle`;
}

function ComplaintPage() {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("complaints") || "[]");
    setComplaints(stored);
  }, []);

  const statusStyle = {
    pending: "bg-orange-400/15 text-orange-300",
    "in-review": "bg-sky-400/15 text-sky-300",
    resolved: "bg-emerald-400/15 text-emerald-300",
  };

  const statusLabel = {
    pending: "Pending",
    "in-review": "In review",
    resolved: "Resolved",
  };

  const pendingCount = complaints.filter((c) => c.status === "pending").length;
  const reviewCount = complaints.filter((c) => c.status === "in-review").length;
  const resolvedCount = complaints.filter((c) => c.status === "resolved").length;

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center px-4 py-6 sm:py-10"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-[95vw] sm:w-[85vw] lg:w-[75vw] bg-slate-950/90 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 flex flex-col gap-6 sm:gap-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between gap-3">
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-300">
            Tumhari{" "}
            <span className="font-semibold text-white">
              {complaints.length}
            </span>{" "}
            complaints hain
          </p>
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-teal-400 text-slate-900 flex items-center justify-center shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 sm:w-8 sm:h-8"
            >
              <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.8 1.6-9.8 4.9v2.7h19.6v-2.7c0-3.3-6.5-4.9-9.8-4.9z" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
          <div className="bg-orange-400/10 border border-orange-400/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col gap-1">
            <span className="text-orange-300 text-3xl sm:text-4xl lg:text-5xl font-bold">
              {pendingCount}
            </span>
            <span className="text-slate-300 text-base sm:text-lg lg:text-xl">Pending</span>
          </div>
          <div className="bg-sky-400/10 border border-sky-400/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col gap-1">
            <span className="text-sky-300 text-3xl sm:text-4xl lg:text-5xl font-bold">
              {reviewCount}
            </span>
            <span className="text-slate-300 text-base sm:text-lg lg:text-xl">In review</span>
          </div>
          <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col gap-1">
            <span className="text-emerald-300 text-3xl sm:text-4xl lg:text-5xl font-bold">
              {resolvedCount}
            </span>
            <span className="text-slate-300 text-base sm:text-lg lg:text-xl">Resolved</span>
          </div>
        </div>

        <button
          onClick={() => navigate("/complaints/new")}
          className="w-full bg-teal-400 hover:bg-teal-300 text-slate-900 font-bold text-lg sm:text-xl lg:text-2xl py-4 sm:py-5 lg:py-6 rounded-xl sm:rounded-2xl transition-colors"
        >
          + New complaint
        </button>

        <div>
          <h3 className="text-lg sm:text-xl font-medium text-slate-300 mb-3">
            Past complaints
          </h3>

          {complaints.length === 0 ? (
            <p className="text-base sm:text-lg text-slate-400 py-8 text-center">
              Abhi koi complaint nahi hai. Naya complaint file karo!
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-white/10">
              {complaints.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 sm:py-5 gap-2 sm:gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-white text-lg sm:text-xl lg:text-2xl truncate">
                      {c.title}
                    </p>
                    <p className="text-sm sm:text-base lg:text-lg text-slate-400 mt-1">
                      {c.category} · {daysAgo(c.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`text-sm sm:text-base lg:text-lg px-4 sm:px-5 py-2 sm:py-2.5 rounded-full whitespace-nowrap shrink-0 font-medium self-start sm:self-auto ${
                      statusStyle[c.status] || "bg-slate-400/15 text-slate-300"
                    }`}
                  >
                    {statusLabel[c.status] || c.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComplaintPage;