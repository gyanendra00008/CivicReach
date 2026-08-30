import React from 'react';

const About = () => {
  return (
    <section id="about" className="relative min-h-screen  w-full bg-[#080d12] px-6  flex flex-col items-center justify-center">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-cyan-400 text-sm tracking-[0.3em] uppercase mb-4">— About CivicReach —</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Bridging Citizens & Government Directly
        </h2>
        <p className="text-white/60 max-w-3xl mx-auto leading-relaxed mb-12">
          CivicReach was built to end the hassle of lost complaints. No more running to offices. 
          Just snap a picture, our platform routes it to the right department, and you track it till it's resolved.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border border-cyan-400/20 rounded-2xl p-8 bg-[#0e1a2a]/40">
          <div>
            <h3 className="text-4xl font-bold text-cyan-400">&lt;2 Min</h3>
            <p className="text-white/60 mt-2 text-sm">To File Complaint</p>
          </div>
          <div className="border-y md:border-y-0 md:border-x border-white/10 py-6 md:py-0">
            <h3 className="text-4xl font-bold text-cyan-400">10+</h3>
            <p className="text-white/60 mt-2 text-sm">Departments Onboarded</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-cyan-400">24/7</h3>
            <p className="text-white/60 mt-2 text-sm">Live Monitoring Active</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;