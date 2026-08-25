import { useLocation, useNavigate } from "react-router-dom";
import bgImage from "../assets/img3.webp";

function ComplaintSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const complaint = state?.complaint;

  if (!complaint) {
    navigate("/complaints");
    return null;
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center px-4 py-16"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-sm bg-slate-950/90 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-teal-400/15 flex items-center justify-center">
          <span className="text-teal-400 text-2xl">✓</span>
        </div>

        <div>
          <h2 className="text-xl font-medium text-white">
            Complaint submitted
          </h2>
          <p className="text-sm text-teal-400 mt-1.5">
            Tumhari complaint sahi authority tak forward kar di gayi hai
          </p>
        </div>

        <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2.5 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Complaint ID</span>
            <span className="text-white font-medium">#{complaint.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Category</span>
            <span className="text-white font-medium">
              {complaint.category}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Status</span>
            <span className="text-xs bg-orange-400/15 text-orange-300 px-2.5 py-1 rounded-full capitalize">
              {complaint.status}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          Status update ke liye email/SMS bhi milega
        </p>

        <button
          onClick={() => navigate("/complaints")}
          className="w-full bg-teal-400 hover:bg-teal-300 text-slate-900 font-medium text-sm py-3 rounded-lg transition-colors"
        >
          Dashboard pe wapas jao
        </button>
      </div>
    </div>
  );
}

export default ComplaintSuccess;