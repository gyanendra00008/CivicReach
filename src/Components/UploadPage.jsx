import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/img3.webp";

const inputClass =
  "w-full text-xl px-4 py-4 rounded-lg bg-white/90 text-slate-900 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-teal-400";

function UploadPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Water");
  const [description, setDescription] = useState("");
  const [location] = useState("Sector 12, Dwarka, New Delhi");
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Title aur Description bharna zaroori hai");
      return;
    }

    const complaint = {
      id: Math.floor(Math.random() * 100000),
      title,
      category,
      description,
      location,
      photo: photo ? photo.name : null,
      status: "pending",
    };

    navigate("/complaints/success", { state: { complaint } });
  };

  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-cover bg-center flex items-center justify-center px-4 py-8"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-[75vw] max-h-[85vh] bg-slate-950/90 backdrop-blur-md border border-white/10 rounded-3xl p-10 flex flex-col gap-6 overflow-y-auto"
      >
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-white">New complaint</h2>
          <p className="text-base text-teal-400 mt-2">
            Details bharo, hum sahi authority tak pahuncha denge
          </p>
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center -mt-2">{error}</p>
        )}

        {/* Title */}
        <div>
          <label className="text-base text-slate-300 block mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Paani ka leakage main road pe"
            className={inputClass}
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-base text-slate-300 block mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            <option>Water</option>
            <option>Electricity</option>
            <option>Roads</option>
            <option>Garbage</option>
            <option>Other</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="text-base text-slate-300 block mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Samasya ke baare mein detail mein likho"
            className={`${inputClass} h-[calc(1.5em*3)] resize-none`}
          />
        </div>

        {/* Location */}
        <div>
          <label className="text-base text-slate-300 block mb-1">
            Location
          </label>
          <div className={`${inputClass} flex justify-between items-center`}>
            <span>📍 {location}</span>
            <span className="text-teal-500 text-sm font-medium">
              Auto-fetched
            </span>
          </div>
        </div>

        {/* Photo */}
        <div>
          <label className="text-base text-slate-300 block mb-1">Photo</label>
          <label
            htmlFor="photo-upload"
            className="border border-dashed border-white/20 rounded-lg py-6 flex flex-col items-center gap-2 cursor-pointer hover:border-teal-400 transition-colors"
          >
            <span className="text-2xl text-teal-400">⬆️</span>
            <p className="text-base text-slate-400">
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
          className="w-full bg-teal-400 hover:bg-teal-300 text-slate-900 font-bold text-xl py-4 rounded-lg transition-colors"
        >
          Submit complaint
        </button>
      </form>
    </div>
  );
}

export default UploadPage;