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

  const steps = ["Submitted", "In review", "Resolved"];
  const statusToStepIndex = { pending: 0, "in-review": 1, resolved: 2 };
  const currentStep = statusToStepIndex[complaint.status] ?? 0;

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center px-4 py-8"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-[#0A1120]/70" />

      <div className="relative z-10 w-full max-w-xl bg-[#111C31] border border-white/5 rounded-2xl p-8 sm:p-10 shadow-2xl shadow-black/40">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-teal-400 text-2xl">✓</span>
          <h1 className="text-xl sm:text-2xl font-semibold text-white">
            Complaint submitted
          </h1>
        </div>
        <p className="text-sm text-slate-400 mb-6">
          Tumhari complaint sahi authority tak forward kar di gayi hai
        </p>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-3 mb-8">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-slate-400 text-sm flex items-center gap-2">
              🆔 Complaint ID
            </span>
            <span className="text-white font-bold text-lg">#{complaint.id}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-slate-400 text-sm flex items-center gap-2">
              📁 Category
            </span>
            <span className="text-white font-bold text-lg">{complaint.category}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm flex items-center gap-2">
              📌 Status
            </span>
            <span className="text-xs bg-orange-400/15 text-orange-300 px-3 py-1 rounded-full capitalize font-semibold">
              {complaint.status}
            </span>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((label, i) => (
            <div key={label} className="flex-1 flex flex-col items-center relative">
              {i !== 0 && (
                <div
                  className={`absolute top-3 right-1/2 w-full h-0.5 -z-0 ${
                    i <= currentStep ? "bg-teal-400" : "bg-white/10"
                  }`}
                />
              )}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                  i <= currentStep
                    ? "bg-teal-400 text-slate-900"
                    : "bg-white/10 text-slate-500"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  i <= currentStep ? "text-teal-400" : "text-slate-500"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/complaints")}
          className="w-full bg-teal-400 hover:bg-teal-300 text-slate-900 font-bold text-base sm:text-lg py-3 rounded-lg transition-colors"
        >
          Dashboard pe wapas jao
        </button>
      </div>
    </div>
  );
}

export default ComplaintSuccess;