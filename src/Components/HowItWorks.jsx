

const HowItWorks = () => {
  return (
    <section className="relative min-h-screen w-full bg-[#080d12] px-6  flex flex-col items-center justify-center">
      {/* stars background */}
      <div className="absolute inset-0 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.15]"></div>

      <div className="relative z-10 w-full max-w-7xl">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-[#9fb8c5] mt-4 text-base md:text-lg">
            Report civic issues in three simple steps — fast, transparent, and trackable.
          </p>
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Card 1 - Snap */}
          <div className="relative group rounded-[20px] border border-[#2dd4bf]/20 bg-[#0f1923]/80 p-8 backdrop-blur-md hover:border-[#2dd4bf]/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(45,212,191,0.15)]">
            <div className="flex flex-col items-center text-center">
              <span className="text-[#4deeea] text-4xl font-bold drop-shadow-[0_0_10px_rgba(77,238,234,0.8)] mb-4">1.</span>

              {/* Icon */}
              <div className="w-36 h-36 my-4 text-[#4deeea] drop-shadow-[0_0_15px_rgba(77,238,234,0.7)]">
                <svg viewBox="0 0 120 150" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full">
                  <rect x="15" y="10" width="70" height="110" rx="12" strokeWidth="4"/>
                  <rect x="22" y="18" width="28" height="22" rx="5" strokeWidth="3"/>
                  <circle cx="36" cy="29" r="7" strokeWidth="2.5"/>
                  <circle cx="36" cy="29" r="2.5" strokeWidth="2"/>
                  <path d="M55 60 Q75 55 70 80 Q65 95 50 85" fill="currentColor" opacity="0.8" stroke="none"/>
                  <ellipse cx="50" cy="135" rx="25" ry="4" strokeWidth="2" opacity="0.6"/>
                  <ellipse cx="50" cy="142" rx="35" ry="8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8"/>
                </svg>
              </div>

              <h3 className="text-3xl font-bold text-white mt-8 mb-3 text-left w-full">1. Snap</h3>
              <p className="text-[#9fb8c5] text-left w-full text-[15px] leading-relaxed">
                Take a photo of the issue using your phone camera.
              </p>
            </div>
          </div>

          {/* Card 2 - AI Sorts */}
          <div className="relative group rounded-[20px] border border-[#2dd4bf]/20 bg-[#0f1923]/80 p-8 backdrop-blur-md hover:border-[#2dd4bf]/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(45,212,191,0.15)]">
            <div className="flex flex-col items-center text-center">
              <span className="text-[#4deeea] text-4xl font-bold drop-shadow-[0_0_10px_rgba(77,238,234,0.8)] mb-2">2.</span>

              <div className="w-44 h-36 my-2 text-[#4deeea] drop-shadow-[0_0_15px_rgba(77,238,234,0.7)]">
                <svg viewBox="0 0 160 110" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
                  {/* Brain */}
                  <path d="M40 60 C20 45 25 15 50 12 C60 5 85 5 95 15 C125 12 135 40 115 60 C120 75 105 95 85 85 C75 90 55 90 45 80 C25 85 25 70 40 60Z" strokeWidth="3"/>
                  <circle cx="55" cy="35" r="3" fill="currentColor" />
                  <circle cx="75" cy="28" r="3" fill="currentColor" />
                  <circle cx="95" cy="35" r="3" fill="currentColor" />
                  <path d="M55 35 L65 40 M75 28 L80 45 M95 35 L90 50" strokeWidth="1.5"/>
                  {/* arrows */}
                  <path d="M115 45 L140 40 M140 40 L135 35 M140 40 L135 45" strokeWidth="2"/>
                  <path d="M118 60 L145 60 M145 60 L140 55 M145 60 L140 65" strokeWidth="2"/>
                  <path d="M110 75 L135 85 M135 85 L130 80 M135 85 L128 87" strokeWidth="2"/>
                  <path d="M70 80 L70 100 M70 100 L65 95 M70 100 L75 95" strokeWidth="2"/>
                  <path d="M50 82 L35 100 M35 100 L40 102 M35 100 L33 95" strokeWidth="2"/>
                  <path d="M90 85 L105 100 M105 100 L100 98 M105 100 L102 95" strokeWidth="2"/>
                </svg>
              </div>

              <div className="flex gap-2 my-2">
                <span className="bg-[#1c3440] text-[#9fb8c5] text-xs px-3 py-1 rounded-lg border border-white/5">MCD</span>
                <span className="bg-[#1c3440] text-[#9fb8c5] text-xs px-3 py-1 rounded-lg border border-white/5">PWD</span>
                <span className="bg-[#1c3440] text-[#9fb8c5] text-xs px-3 py-1 rounded-lg border border-white/5">Water Dept</span>
              </div>

              <h3 className="text-3xl font-bold text-white mt-4 mb-3 text-left w-full">2. AI Sorts</h3>
              <p className="text-[#9fb8c5] text-left w-full text-[15px] leading-relaxed">
                Our AI classifies the issue & routes it to the right department instantly.
              </p>
            </div>
          </div>

          {/* Card 3 - Track */}
          <div className="relative group rounded-[20px] border border-[#2dd4bf]/20 bg-[#0f1923]/80 p-8 backdrop-blur-md hover:border-[#2dd4bf]/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(45,212,191,0.15)]">
            <div className="flex flex-col items-center text-center">
              <span className="text-[#4deeea] text-4xl font-bold drop-shadow-[0_0_10px_rgba(77,238,234,0.8)] mb-4">3.</span>

              <div className="w-36 h-36 my-4 text-[#4deeea] drop-shadow-[0_0_15px_rgba(77,238,234,0.7)]">
                <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="4" className="w-full h-full">
                  <path d="M60 10 C35 10 15 30 15 55 C15 85 60 115 60 115 C60 115 105 85 105 55 C105 30 85 10 60 10Z"/>
                  <circle cx="55" cy="50" r="15" strokeWidth="3"/>
                  <circle cx="55" cy="50" r="7" strokeWidth="3"/>
                  <circle cx="55" cy="50" r="2" fill="currentColor"/>
                  <circle cx="80" cy="80" r="20" fill="#0f1923" strokeWidth="3"/>
                  <path d="M70 80 L76 86 L90 72" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>

              <div className="w-full mt-6">
                <div className="h-1.5 w-full bg-[#1c3440] rounded-full flex">
                  <div className="h-full w-[60%] bg-[#4deeea] rounded-full"></div>
                  <div className="h-full w-[15%] bg-[#4deeea] rounded-full ml-1 opacity-60"></div>
                  <div className="h-full flex-1 bg-[#1c3440] rounded-full ml-1"></div>
                </div>
                <div className="flex justify-between mt-2 text-[12px]">
                  <span className="text-[#4deeea] flex items-center gap-1">✔ Received</span>
                  <span className="text-[#4deeea]">● In Progress</span>
                  <span className="text-gray-500">Resolved</span>
                </div>
              </div>

              <p className="text-[#9fb8c5] text-left w-full text-[15px] leading-relaxed mt-6">
                Track real-time status updates until the issue is resolved.
              </p>
            </div>
          </div>

        </div>

        <p className="text-center text-[#4a6a7a] text-sm mt-16 tracking-wide">
          CivicReach • Civic issues reported, monitored, resolved
        </p>
      </div>
    </section>
  );
};

export default HowItWorks;