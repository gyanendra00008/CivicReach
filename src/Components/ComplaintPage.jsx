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

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center px-4 py-16"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-md bg-slate-950/90 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col gap-5 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <p className="text-base text-slate-300">
            Tumhari{" "}
            <span className="font-medium text-white">
              {complaints.length}
            </span>{" "}
            complaints hain
          </p>
          <div className="w-10 h-10 rounded-full bg-teal-400 text-slate-900 text-sm font-medium flex items-center justify-center shrink-0">
            PS
          </div>
        </div>

        <button
          onClick={() => navigate("/complaints/new")}
          className="w-full bg-teal-400 hover:bg-teal-300 text-slate-900 font-medium text-base py-3.5 rounded-lg transition-colors"
        >
          + New complaint
        </button>

        <div>
          <h3 className="text-sm font-medium text-slate-300 mb-2">
            Past complaints
          </h3>

          {complaints.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">
              Abhi koi complaint nahi hai. Naya complaint file karo!
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-white/10">
              {complaints.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between py-4 gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-white text-base truncate">
                      {c.title}
                    </p>
                    <p className="text-sm text-slate-400 mt-0.5">
                      {c.category} · {daysAgo(c.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 ${
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