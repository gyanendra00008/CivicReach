import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Tag, AlignLeft, MapPin, Upload, Send, ArrowLeft, Loader2, Image as ImageIcon, X } from "lucide-react";
import bgImage from "../assets/img3.webp";
import { FASTAPI_API_URL } from "../config";

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

export default function UploadPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Electricity");
  const [description, setDescription] = useState("");
  const [pincode, setPincode] = useState("110075");
  const [district, setDistrict] = useState("South West Delhi");
  const [stateName, setStateName] = useState("Delhi");
  const [locationText, setLocationText] = useState("Detecting GPS location...");
  const [photoBase64, setPhotoBase64] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  // 1. Auth check & GPS detection
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");
    if (!userStr && !token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const u = JSON.parse(userStr || "{}");
      setUser(u);
    } catch (e) {
      setUser({ email: "user@civicreach.app" });
    }

    detectLocation();
  }, [navigate]);

  const detectLocation = () => {
    if (navigator.geolocation) {
      setGpsLoading(true);
      setLocationText("Acquiring GPS coordinates...");
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(`${FASTAPI_API_URL}/Location/${latitude}/${longitude}`);
            const data = await res.json();
            if (data.status === "success" && data.district) {
              const d = data.district || "South West Delhi";
              const s = data.state || "Delhi";
              const p = data.pincode && data.pincode !== "postcode not found" ? data.pincode : "110075";
              
              setDistrict(d);
              setStateName(s);
              setPincode(p);
              setLocationText(`${d}, ${s} (Pincode: ${p})`);
            } else {
              fallbackLocation();
            }
          } catch (err) {
            fallbackLocation();
          } finally {
            setGpsLoading(false);
          }
        },
        () => {
          fallbackLocation();
          setGpsLoading(false);
        },
        { timeout: 60000}
      );
    } else {
      fallbackLocation();
    }
  };

  const fallbackLocation = () => {
    setLocationText("Sector 12, Dwarka, South West Delhi (110075)");
    setDistrict("South West Delhi");
    setStateName("Delhi");
    setPincode("110075");
  };

  // Convert uploaded image to Base64 data URL
  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoName(file.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!pincode.toString().trim()) newErrors.pincode = "Pincode is required";
    if (!district.trim()) newErrors.district = "District is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const userEmail = user?.email || "user@civicreach.app";

    const payload = {
      pincode: pincode.toString().trim(),
      district: district.trim(),
      state: stateName.trim(),
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      img_url: photoBase64 || "",
      user_email: userEmail.trim().toLowerCase(),
    };

    try {
      setSubmitting(true);
      const response = await fetch(`${FASTAPI_API_URL}/api/problems`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Problem submit karne me dikkat hui");
      }

      const createdComplaint = data.problem || {
        id: Math.floor(Math.random() * 100000),
        ...payload,
        status: "pending",
      };

      navigate("/complaints/success", { state: { complaint: createdComplaint } });
    } catch (err) {
      console.error("Submission error:", err);
      setErrors({ submit: err.message || "Failed to submit complaint to database." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden px-4 py-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-[#0A1120]/80 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-xl sm:max-w-2xl my-6">
        <div className="bg-[#111C31] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl">
          
          <button
            onClick={() => navigate("/user-dashboard")}
            className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-400 hover:text-teal-300 mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>

          <div className="mb-6 text-center">
            <div className="w-12 h-12 rounded-full bg-teal-400/15 text-teal-400 flex items-center justify-center mx-auto mb-2 border border-teal-500/20">
              <FileText size={22} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Report Civic Problem
            </h1>
            <p className="text-xs sm:text-sm text-teal-400 mt-1">
              Live routing to {district ? `[${district}]` : "Department"} Authorities
            </p>
          </div>

          {errors.submit && (
            <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs sm:text-sm">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
            {/* Title */}
            <div>
              <label className="text-xs sm:text-sm font-medium text-slate-400 mb-1.5 block">
                Problem Title *
              </label>
              <div
                className={`flex items-center gap-2.5 bg-[#0B1526] border rounded-xl px-3.5 py-3 transition-colors ${
                  errors.title ? "border-red-500/60" : "border-white/10 focus-within:border-teal-400/60"
                }`}
              >
                <FileText size={16} className="text-sky-400 shrink-0" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Streetlight broken near Main Market"
                  className="flex-1 bg-transparent outline-none text-sm sm:text-base text-white placeholder:text-slate-600"
                />
              </div>
              {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
            </div>

            {/* Category & Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Category */}
              <div>
                <label className="text-xs sm:text-sm font-medium text-slate-400 mb-1.5 block">
                  Category *
                </label>
                <div className="flex items-center gap-2.5 bg-[#0B1526] border border-white/10 rounded-xl px-3.5 py-3 focus-within:border-teal-400/60">
                  <Tag size={16} className="text-amber-400 shrink-0" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm sm:text-base text-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#0B1526] text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label className="text-xs sm:text-sm font-medium text-slate-400 mb-1.5 block">
                  Area Pincode *
                </label>
                <div className="flex items-center gap-2.5 bg-[#0B1526] border border-white/10 rounded-xl px-3.5 py-3 focus-within:border-teal-400/60">
                  <MapPin size={16} className="text-teal-400 shrink-0" />
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 110075"
                    className="flex-1 bg-transparent outline-none text-sm sm:text-base text-white placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* District Jurisdiction */}
            <div>
              <label className="text-xs sm:text-sm font-medium text-slate-400 mb-1.5 block">
                District / Area *
              </label>
              <div className="flex items-center gap-2.5 bg-[#0B1526] border border-white/10 rounded-xl px-3.5 py-3 focus-within:border-teal-400/60">
                <MapPin size={16} className="text-rose-400 shrink-0" />
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. South West Delhi"
                  className="flex-1 bg-transparent outline-none text-sm sm:text-base text-white placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs sm:text-sm font-medium text-slate-400 mb-1.5 block">
                Description *
              </label>
              <div
                className={`flex items-start gap-2.5 bg-[#0B1526] border rounded-xl px-3.5 py-3 transition-colors ${
                  errors.description ? "border-red-500/60" : "border-white/10 focus-within:border-teal-400/60"
                }`}
              >
                <AlignLeft size={16} className="text-pink-400 shrink-0 mt-0.5" />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Samasya ke baare me vistar se batayein..."
                  rows={3}
                  className="flex-1 bg-transparent outline-none text-sm sm:text-base text-white placeholder:text-slate-600 resize-none"
                />
              </div>
              {errors.description && (
                <p className="text-xs text-red-400 mt-1">{errors.description}</p>
              )}
            </div>

            {/* Auto GPS Detection Banner */}
            <div className="bg-[#0B1526] border border-white/10 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <MapPin size={15} className="text-rose-400 shrink-0" />
                <span className="text-xs text-slate-300 truncate">
                  {gpsLoading ? "Acquiring GPS location..." : locationText}
                </span>
              </div>
              <button
                type="button"
                onClick={detectLocation}
                className="text-[11px] text-teal-400 hover:text-teal-300 font-medium shrink-0 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20"
              >
                Refresh GPS
              </button>
            </div>

            {/* Photo Upload with Live Thumbnail Preview */}
            <div>
              <label className="text-xs sm:text-sm font-medium text-slate-400 mb-1.5 block">
                Photo Evidence (Photo click ya upload karein)
              </label>

              {photoBase64 ? (
                <div className="relative bg-[#0B1526] border border-teal-500/30 rounded-xl p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={photoBase64}
                      alt="Uploaded Preview"
                      className="w-12 h-12 rounded-lg object-cover border border-white/10"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium text-white truncate">{photoName || "Photo Evidence"}</span>
                      <span className="text-[10px] text-teal-400">Ready to route to authority</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPhotoBase64("");
                      setPhotoName("");
                    }}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 flex items-center justify-center transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="photo-upload"
                  className="border border-dashed border-white/15 rounded-xl py-6 flex flex-col items-center gap-1.5 cursor-pointer hover:border-teal-400/60 transition-colors bg-[#0B1526]/40"
                >
                  <Upload size={20} className="text-teal-400" />
                  <p className="text-xs text-slate-300 font-medium">
                    Click to take photo or choose file
                  </p>
                  <p className="text-[11px] text-slate-500">PNG, JPG up to 10MB</p>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm sm:text-base rounded-xl py-3 flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/10 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Routing to Authority Database...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Submit & Route Complaint</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
