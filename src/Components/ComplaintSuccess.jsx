import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import bgImage from "../assets/img3.webp";

function ComplaintSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const complaint = state?.complaint;

  useEffect(() => {
    if (!complaint) {
      navigate("/complaints");
    }
  }, [complaint, navigate]);

  if (!complaint) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-cover bg-center flex items-center justify-center px-4 py-6"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-[75vw] max-h-[90vh] bg-slate-950/90 backdrop-blur-md border border-white/10 rounded-3xl p-12 flex flex-col gap-10 overflow-y-auto">
        {/* TOP: icon + heading */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-20 h-20 rounded-full bg-teal-400/15 flex items-center justify-center">
            <span className="text-teal-400 text-4xl">✓</span>
          </div>
          <h2 className="text-4xl font-semibold text-white">
            Complaint submitted
          </h2>
          <p className="text-lg text-teal-400">
            Tumhari complaint sahi authority tak forward kar di gayi hai
          </p>
        </div>

        {/* MIDDLE: details box */}
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-10 flex flex-col gap-8 text-left">
          <div className="flex justify-between items-center gap-4 border-b border-white/10 pb-6">
            <span className="text-slate-400 text-2xl flex items-center gap-2 shrink-0">
              <span className="text-teal-400">🆔</span> Complaint ID
            </span>
            <span className="text-white font-bold text-4xl tracking-wide truncate">
              #{complaint.id}
            </span>
          </div>

          <div className="flex justify-between items-center gap-4 border-b border-white/10 pb-6">
            <span className="text-slate-400 text-2xl flex items-center gap-2 shrink-0">
              <span className="text-teal-400">📁</span> Category
            </span>
            <span className="text-white font-bold text-4xl truncate">
              {complaint.category}
            </span>
          </div>

          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400 text-2xl flex items-center gap-2 shrink-0">
              <span className="text-teal-400">📌</span> Status
            </span>
            <span className="text-xl bg-orange-400/15 text-orange-300 px-6 py-3 rounded-full capitalize font-semibold shrink-0">
              {complaint.status}
            </span>
          </div>
        </div>

        {/* BOTTOM: note + button */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-base text-slate-400">
            Status update ke liye email/SMS bhi milega
          </p>
          <button
            onClick={() => navigate("/complaints")}
            className="w-full bg-teal-400 hover:bg-teal-300 text-slate-900 font-bold text-2xl py-5 rounded-lg transition-colors"
          >
            Dashboard pe wapas jao
          </button>
        </div>
      </div>
    </div>
  );
}

export default ComplaintSuccess;