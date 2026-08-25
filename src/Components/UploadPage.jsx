import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/img3.webp";

function UploadPage() {
  const [form, setForm] = useState({
    title: "",
    category: "Water",
    description: "",
    location: "Sector 12, Dwarka, New Delhi",
    image: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newComplaint = {
      id: "CMP" + Math.floor(10000 + Math.random() * 89999),
      title: form.title,
      category: form.category,
      description: form.description,
      location: form.location,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("complaints") || "[]");
    localStorage.setItem(
      "complaints",
      JSON.stringify([newComplaint, ...existing])
    );

    navigate("/complaints/success", { state: { complaint: newComplaint } });
  };

  const inputClass =
    "w-full bg-white/95 rounded-lg px-4 py-3.5 text-base text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-teal-400 transition-all border-none";

  const labelClass = "text-base text-white block mb-2";

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center px-4 py-16"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-slate-950/90 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col gap-5"
      >
        <div className="text-center">
          <h2 className="text-2xl font-medium text-white">New complaint</h2>
          <p className="text-sm text-teal-400 mt-1.5">
            Details bharo, hum sahi authority tak pahuncha denge
          </p>
        </div>

        <div>
          <label className={labelClass}>Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Paani ka leakage main road pe"
            value={form.title}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="Water">Water</option>
            <option value="Electricity">Electricity</option>
            <option value="Roads">Roads</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Public Safety">Public Safety</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            rows="3"
            placeholder="Samasya ke baare mein detail mein likho"
            value={form.description}
            onChange={handleChange}
            className={`${inputClass} resize-none`}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Location</label>
          <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-3.5">
            <span className="flex items-center gap-2 text-sm text-white">
              <span className="text-teal-400">📍</span>
              {form.location}
            </span>
            <span className="text-xs text-teal-400">Auto-fetched</span>
          </div>
        </div>

        <div>
          <label className={labelClass}>Photo</label>
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/20 rounded-lg py-8 cursor-pointer hover:border-teal-400 transition-colors bg-white/5">
            <span className="w-9 h-9 rounded-full bg-teal-400 text-slate-900 flex items-center justify-center text-lg">
              ⬆
            </span>
            <span className="text-sm text-slate-300 text-center px-4">
              {form.image
                ? form.image.name
                : "Photo upload karo ya yahan drag karo"}
            </span>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-teal-400 hover:bg-teal-300 text-slate-900 font-medium text-base py-3.5 rounded-lg transition-colors mt-2"
        >
          Submit complaint
        </button>
      </form>
    </div>
  );
}

export default UploadPage;