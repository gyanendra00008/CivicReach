import React from 'react';

const Contact = () => {
  return (
    <footer className="w-full bg-[#080d12] py-20 flex justify-center">
      {/* ye div ab 100% center rahega */}
      <div className="w-full max-w-7xl flex flex-col items-center justify-center text-center mx-auto px-6">

        <h2 className="text-white text-4xl font-bold text-center w-full">
          Contact Us
        </h2>
        
        <div className="mt-6 flex flex-col items-center justify-center text-center">
          <p className="text-white/60 text-center">
            Email: <span className="text-cyan-400">admin.civicreach@gmail.com</span>
          </p>
          <p className="text-white/60 mt-2 text-center">
            Website: <span className="text-white">https://civic-reach-iota.vercel.app/</span>
          </p>
          <p className="text-white/40 text-sm mt-3 text-center">
            We usually reply within 24 hours.
          </p>
        </div>

        <div className="mt-10 text-white/20 text-sm text-center w-full">
          © 2026 CivicReach. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Contact;