import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Tag, AlignLeft, MapPin, Upload, Send } from "lucide-react";
import bgImage from "../assets/img3.webp";

const CATEGORIES = ["Water", "Electricity", "Roads", "Sanitation", "Health", "Other"];

export default function UploadPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Water");
  const [description, setDescription] = useState("");
  const [location] = useState("Sector 12, Dwarka, New Delhi");
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const complaint = {
      id: Math.floor(Math.random() * 100000),
      title,
      category,
      description,
      location,
      photo: photo ? photo.name : null,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const stored = JSON.parse(localStorage.getItem("complaints") || "[]");
    localStorage.setItem("complaints", JSON.stringify([complaint, ...stored]));

    navigate("/complaints/success", { state: { complaint } });
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden px-4 py-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-[#0A1120]/70" />

      <div className="relative z-10 w-full max-w-xl sm:max-w-3xl">
        <div className="bg-[#111C31] border border-white/5 rounded-2xl sm:rounded-3xl p-8 sm:p-14 shadow-2xl shadow-black/40">
          <div className="mb-6 sm:mb-8 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-teal-400/15 flex items-center justify-center mx-auto mb-3">
              <FileText size={26} className="text-teal-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              New complaint
            </h1>
            <p className="text-base sm:text-lg text-teal-400 mt-2">
              Details bharo, hum sahi authority tak pahuncha denge
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7" noValidate>
            {/* Title */}
            <div>
              <label className="text-lg sm:text-xl font-medium text-slate-400 mb-2 block">
                Title
              </label>
              <div
                className={`flex items-center gap-3 bg-[#0B1526] border rounded-lg px-4 sm:px-5 py-4 transition-colors ${
                  errors.title ? "border-red-500/60" : "border-white/5 focus-within:border-teal-400/60"
                }`}
              >
                <div className="w-8 h-8 rounded-md bg-sky-500/15 flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-sky-400" />
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Paani ka leakage main road pe"
                  className="flex-1 bg-transparent outline-none text-lg sm:text-xl text-white placeholder:text-slate-600"
                />
              </div>
              {errors.title && <p className="text-sm text-red-400 mt-1.5">{errors.title}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="text-lg sm:text-xl font-medium text-slate-400 mb-2 block">
                Category
              </label>
              <div className="flex items-center gap-3 bg-[#0B1526] border border-white/5 rounded-lg px-4 sm:px-5 py-4 focus-within:border-teal-400/60">
                <div className="w-8 h-8 rounded-md bg-amber-500/15 flex items-center justify-center shrink-0">
                  <Tag size={16} className="text-amber-400" />
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-lg sm:text-xl text-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#0B1526] text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-lg sm:text-xl font-medium text-slate-400 mb-2 block">
                Description
              </label>
              <div
                className={`flex items-start gap-3 bg-[#0B1526] border rounded-lg px-4 sm:px-5 py-4 transition-colors ${
                  errors.description ? "border-red-500/60" : "border-white/5 focus-within:border-teal-400/60"
                }`}
              >
                <div className="w-8 h-8 rounded-md bg-pink-500/15 flex items-center justify-center shrink-0 mt-0.5">
                  <AlignLeft size={16} className="text-pink-400" />
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Samasya ke baare mein detail mein likho"
                  rows={4}
                  className="flex-1 bg-transparent outline-none text-lg sm:text-xl text-white placeholder:text-slate-600 resize-none"
                />
              </div>
              {errors.description && (
                <p className="text-sm text-red-400 mt-1.5">{errors.description}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="text-lg sm:text-xl font-medium text-slate-400 mb-2 block">
                Location
              </label>
              <div className="flex items-center justify-between gap-3 bg-[#0B1526] border border-white/5 rounded-lg px-4 sm:px-5 py-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-md bg-rose-500/15 flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-rose-400" />
                  </div>
                  <span className="text-lg sm:text-xl text-white truncate">{location}</span>
                </div>
                <span className="text-sm sm:text-base text-teal-400 font-medium shrink-0">
                  Auto-fetched
                </span>
              </div>
            </div>

            {/* Photo */}
            <div>
              <label className="text-lg sm:text-xl font-medium text-slate-400 mb-2 block">
                Photo
              </label>
              <label
                htmlFor="photo-upload"
                className="border border-dashed border-white/15 rounded-lg py-10 flex flex-col items-center gap-2 cursor-pointer hover:border-teal-400/60 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/15 flex items-center justify-center">
                  <Upload size={20} className="text-blue-400" />
                </div>
                <p className="text-base sm:text-lg text-slate-400">
                  {photo ? photo.name : "Photo upload karo ya yahan drag karo"}
                </p>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-400 text-[#0A1120] font-bold text-lg sm:text-xl rounded-xl py-4 flex items-center justify-center gap-2 transition-colors"
            >
              <Send size={20} />
              Submit complaint
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}