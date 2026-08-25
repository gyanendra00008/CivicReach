import React from 'react';

const Authorities = () => {
  const departments = [
    {
      title: 'MCD',
      subtitle: 'Municipal Corp Delhi',
      tags: ['Roads', 'Waste', 'Public Hygiene', 'Streetlights'],
      officers: '24 officers assigned'
    },
    {
      title: 'PWD',
      subtitle: 'Public Works Dept',
      tags: ['Roads', 'Infrastructure', 'Bridges', 'Drainage'],
      officers: '18 officers assigned'
    },
    {
      title: 'Water Dept',
      subtitle: 'Water Department',
      tags: ['Water supply', 'Leaks', 'Pipeline', 'Drainage'],
      officers: '12 officers assigned'
    }
  ];

  return (
    <section id="authorities"  className="relative  w-full bg-[#080d12] px-6  flex flex-col items-center justify-center">
      {/* Heading Center */}
      <div className="text-center mb-14">
        <p className="text-cyan-400 text-sm tracking-[0.3em] uppercase mb-4">
          — Authorities —
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Connected to your local departments
        </h2>
        <p className="text-white/50 mt-3 max-w-2xl mx-auto">
          Monitor and coordinate with all local government departments • Real-time reporting & response tracking
        </p>
      </div>

      {/* 3 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {departments.map((dept, index) => (
          <div
            key={index}
            className="relative group bg-[#0e1a2a]/60 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-8 text-center hover:border-cyan-400/50 hover:-translate-y-2 transition-all duration-300"
          >
            {/* Online Tag Top */}
            <div className="absolute top-4 right-4">
              <span className="text-[11px] bg-green-500/10 border border-green-400/30 text-green-400 px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Online • Receiving reports
              </span>
            </div>

            {/* Icon */}
            <div className="w-16 h-16 mx-auto mt-6 mb-5 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center group-hover:bg-cyan-400/20 transition">
              <span className="text-3xl">🏛️</span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white">{dept.title}</h3>
            <p className="text-cyan-400 font-semibold text-sm mt-1">{dept.subtitle}</p>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2 mt-5 mb-6">
              {dept.tags.map((tag, i) => (
                <span key={i} className="text-[11px] bg-white/5 border border-white/10 text-white/60 px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            {/* Officers */}
            <div className="border-t border-white/10 pt-4 mt-2 flex items-center justify-center gap-2 text-white/50 text-sm">
              <span>👥</span> {dept.officers}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Authorities;