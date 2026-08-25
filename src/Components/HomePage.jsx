import React from 'react'
import bg from '../assets/img3.png'
import hero from '../assets/hero.png'
 import pin from '../assets/pin.png'
 import Reveal from "../components/Reveal";
 import HowItWorks from "./HowItWorks";
 import Authorities from "./Authorities";
 import Contact from "./Contact";
 import About from "./About";


const HomePage = () => {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative text-white font-sans overflow-x-hidden"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Background Dark & Radial Overlay */}
      <div className="absolute inset-0 bg-[#030914]/85"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_50%,rgba(20,184,166,0.18),transparent_55%)]"></div>

      {/* Main Container - Added proper Padding & Margin */}
      <div className="relative z-10 flex flex-col min-h-screen w-full max-w-[100%] mx-auto px-4">
        
        {/* Floating Navigation Bar */}
        <nav className="mt-10 w-[98%] mx-auto ml-4xl flex items-center justify-between px-10 py-8 bg-[#0a1628]/90 border border-teal-500/30 rounded-2xl backdrop-blur-xl" style={{minHeight: '80px'}}>
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-teal-400/20 flex items-center justify-center text-teal-300 border border-teal-400/30 text-xs font-bold">
              📍
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white">CivicRoute</h1>
          </div>

          {/* Navigation Links */}
         <div className="hidden md:flex items-center gap-8 text-base text-gray-300">
  <a href="#home" className="text-white border-b-2 border-teal-400 pb-1 text-[18px] font-semibold">Home</a>
  <a href="#how-it-works" className="hover:text-white transition-colors text-[18px] font-medium">How it Works</a>
  <a href="#authorities" className="hover:text-white transition-colors text-[18px] font-medium">Authorities</a>
  <a href="#about" className="hover:text-white transition-colors text-[18px] font-medium">About</a>
  <a href="#contact" className="hover:text-white transition-colors text-[18px] font-medium">Contact</a>
</div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button className="bg-teal-400 hover:bg-teal-300 text-black text-[16px] font-bold px-7 py-4 rounded-md transition-all shadow-[0_0_15px_rgba(45,212,191,0.4)]">
              Track Complaint
            </button>
            <button className="bg-teal-400 hover:bg-teal-300 text-black text-[16px] font-bold px-7 py-4 rounded-md transition-all shadow-[0_0_15px_rgba(45,212,191,0.4)]">
              Report Issue
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" className=" min-h-screen w-full bg-cover bg-center relative flex flex-col md:flex-row items-center justify-between text-center gap-12 md:pt-28 pb-20 ">
          {/* Full Page Dotted Stars - HEAVY SPARKLE */}
<div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
  {/* Top Stars  at background*/}
  <div className="absolute top-[8%] left-[4%] w-2 h-2 bg-cyan-300 rounded-full shadow-[0_0_10px_3px_rgba(34,211,238,0.8)] animate-pulse"></div>
  <div className="absolute top-[12%] left-[15%] w-1 h-1 bg-white rounded-full animate-[ping_2s_infinite]"></div>
  <div className="absolute top-[10%] left-[28%] w-1.5 h-1.5 bg-teal-200 rounded-full shadow-[0_0_8px_2px_rgba(45,246,179,0.7)] animate-pulse"></div>
  <div className="absolute top-[18%] left-[35%] w-1 h-1 bg-white/80 rounded-full animate-ping"></div>
  <div className="absolute top-[14%] left-[50%] w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_12px_4px_rgba(34,211,238,0.9)] animate-[pulse_1s_infinite]"></div>
  <div className="absolute top-[20%] left-[62%] w-1 h-1 bg-white rounded-full animate-[ping_2.5s_infinite]"></div>
  <div className="absolute top-[10%] left-[75%] w-1.5 h-1.5 bg-teal-300 rounded-full animate-pulse"></div>
  <div className="absolute top-[15%] left-[90%] w-2 h-2 bg-cyan-300 rounded-full shadow-[0_0_10px_3px_rgba(34,211,238,0.8)] animate-pulse"></div>

  {/* Middle - text ke aas paas */}
  <div className="absolute top-[30%] left-[8%] w-1 h-1 bg-cyan-200 rounded-full animate-ping"></div>
  <div className="absolute top-[35%] left-[22%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_2px_white] animate-[pulse_1.2s_infinite]"></div>
  <div className="absolute top-[32%] left-[42%] w-2 h-2 bg-teal-300 rounded-full shadow-[0_0_10px_3px_rgba(45,246,179,0.8)] animate-pulse"></div>
  <div className="absolute top-[45%] left-[52%] w-1 h-1 bg-cyan-300 rounded-full animate-[ping_2s_infinite]"></div>
  <div className="absolute top-[48%] left-[68%] w-1.5 h-1.5 bg-white/90 rounded-full animate-pulse"></div>
  <div className="absolute top-[38%] left-[88%] w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>

  {/* Bottom Area */}
  <div className="absolute top-[65%] left-[5%] w-1.5 h-1.5 bg-cyan-300/80 rounded-full shadow-[0_0_8px_2px_rgba(34,211,238,0.6)] animate-pulse"></div>
  <div className="absolute top-[70%] left-[18%] w-1 h-1 bg-white/60 rounded-full animate-[ping_3s_infinite]"></div>
  <div className="absolute top-[75%] left-[38%] w-2 h-2 bg-teal-200 rounded-full shadow-[0_0_10px_3px_rgba(45,246,179,0.7)] animate-[pulse_1.5s_infinite]"></div>
  <div className="absolute top-[80%] left-[50%] w-1 h-1 bg-white rounded-full animate-ping"></div>
  <div className="absolute top-[78%] left-[72%] w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_3px_rgba(34,211,238,0.8)] animate-pulse"></div>
  <div className="absolute top-[85%] left-[88%] w-1 h-1 bg-teal-300 rounded-full animate-[ping_2s_infinite]"></div>
  <div className="absolute top-[60%] left-[92%] w-2 h-2 bg-cyan-300 rounded-full shadow-[0_0_12px_4px_rgba(34,211,238,0.9)] animate-pulse"></div>
</div>
          {/* Left Text Content */}
          
          <div className=" max-w-3xl mx-auto text-center flex flex-col items-center translate-x-8 lg:translate-x-16 translate-y-10 lg:-translate-y-14">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold leading-[1.12] tracking-tight mb-6 text-white">
              Every <br />
              complaint, <br />
              <span className="text-teal-400">routed to the <br />right desk.</span>
            </h1>

            <p className="text-gray-300 text-base sm:text-base mb-8 max-w-md leading-relaxed">
              Pin the problem on the map, and CivicRoute finds the exact authority responsible—no more complaints lost between departments.
            </p>

            {/* CTA Buttons */}
              {/* CTA Buttons */}
   {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-2 z-20 relative">
              <button className="bg-teal-400 hover:bg-teal-300 text-black font-bold text-xl px-8 py-3.5 rounded-md shadow-lg hover:shadow-teal-400/50 transition-all duration-300">
                ✉️ User Login
              </button>
              <button className="border border-gray-400 text-white text-xl px-8 py-3.5 rounded-md hover:bg-white/10 transition-all duration-300">
                🛡️ Authority Login
              </button>
  </div>
          </div>
          {/* Middle Spark / Glowing Particles - jo tumne circle kiya hai */}
<div className="absolute top-[45%] left-[58%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] pointer-events-none z-10">
  {/* bade spark */}
  <div className="absolute top-10 left-20 w-2 h-2 bg-cyan-300 rounded-full shadow-[0_0_10px_4px_rgba(34,211,238,0.8)] animate-pulse"></div>
  <div className="absolute top-32 left-10 w-1.5 h-1.5 bg-teal-200 rounded-full shadow-[0_0_8px_3px_rgba(45,246,179,0.7)] animate-[ping_2s_ease-in-out_infinite]"></div>
  <div className="absolute top-20 right-16 w-1 h-1 bg-white rounded-full animate-ping"></div>
  <div className="absolute bottom-20 left-32 w-2 h-2 bg-[#2CF6B3] rounded-full blur-[0.5px] shadow-[0_0_12px_5px_rgba(45,246,179,0.6)] animate-pulse"></div>
  {/* chote floating dots */}
  <div className="absolute top-0 left-1/2 w-1 h-1 bg-cyan-400/60 rounded-full animate-[bounce_3s_infinite]"></div>
  <div className="absolute bottom-10 right-10 w-1 h-1 bg-teal-300/50 rounded-full animate-[pulse_1.5s_infinite]"></div>
</div>

          {/* Right Holographic Target/Radar Section */}
          <div className="flex-1 w-full max-w-lg flex items-center justify-center relative">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center">
              
              {/* Bada Radar Circle - Photo jaisa */}
<div className="absolute right-[5%] top-1/2 -translate-y-1/2 hidden lg:block">
  <div className="relative w-[600px] h-[600px] flex items-center justify-center">

    {/* 8 bade circles - ek ke andar ek */}
    <div className="absolute w-[580px] h-[580px] rounded-full border border-white/[0.06]"></div>
    <div className="absolute w-[520px] h-[520px] rounded-full border border-cyan-300/10"></div>
    <div className="absolute w-[460px] h-[460px] rounded-full border border-cyan-300/15"></div>
    <div className="absolute w-[400px] h-[400px] rounded-full border border-cyan-300/15"></div>
    <div className="absolute w-[340px] h-[340px] rounded-full border border-cyan-300/15"></div>
    <div className="absolute w-[280px] h-[280px] rounded-full border border-cyan-300/20 bg-cyan-500/[0.04]"></div>
    <div className="absolute w-[220px] h-[220px] rounded-full border border-cyan-300/25 shadow-[0_0_60px_rgba(34,211,238,0.15)]"></div>
    <div className="absolute w-[140px] h-[140px] rounded-full border border-cyan-300/30 shadow-[0_0_40px_rgba(34,211,238,0.2)]"></div>

    
  

  </div>
</div>
{/* FINAL HERO - Dim Circles + Rotating Dots + 3 Issue Boxes */}
<div className="absolute right-[2%] top-1/2 -translate-y-1/2 hidden lg:block">
  <div className="relative w-[650px] h-[650px] flex items-center justify-center">

    {/* 1. Dim Base Circles */}
    <div className="absolute w-[600px] h-[600px] rounded-full border border-white/[0.04]"></div>
    <div className="absolute w-[540px] h-[540px] rounded-full border border-cyan-300/[0.06]"></div>
    <div className="absolute w-[480px] h-[480px] rounded-full border border-cyan-300/10"></div>
    <div className="absolute w-[400px] h-[400px] rounded-full border border-cyan-300/10"></div>
    <div className="absolute w-[320px] h-[320px] rounded-full border border-cyan-300/10"></div>

    {/* 2. Center Cyan Glow Background */}
    <div className="absolute w-[400px] h-[400px] bg-cyan-500/[0.07] rounded-full blur-[40px]"></div>

    {/* 3. Rotating White Dots - Circle ko highlight karenge */}
    {/* Outer Circle Dots */}
    <div className="absolute w-[540px] h-[540px] rounded-full animate-[spin_10s_linear_infinite]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_12px_white]"></div>
      <div className="absolute bottom-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyan-200 rounded-full shadow-[0_0_8px_#a5f3fc]"></div>
    </div>
    {/* Middle Circle Dots */}
    <div className="absolute w-[400px] h-[400px] rounded-full animate-[spin_7s_linear_infinite_reverse]">
      <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_15px_white]"></div>
    </div>
    {/* Inner Circle Dots */}
    <div className="absolute w-[320px] h-[320px] rounded-full animate-[spin_12s_linear_infinite]">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]"></div>
    </div>

    

    {/* 5. Center Pin - Bilkul centre me lock */}
    <div className="relative z-20 flex items-center justify-center">
      <div className="absolute w-24 h-24 bg-cyan-400/20 rounded-full blur-[12px] animate-pulse"></div>
      <div className="relative w-16 h-16 bg-[#5efcf7] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(94,252,247,0.6)]">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="white"/>
        </svg>
      </div>
    </div>

    {/* 6. 3 COMPLAINT BOXES - Connected to circles */}
    {/* Box 1 - Top Right - Pothole */}
    <div className="absolute top-[8%] right-[5%] z-30">
      <div className="bg-[#111a2f]/80 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 w-[210px] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-orange-500/20 flex items-center justify-center text-[14px]">⚠️</span>
          <div>
            <p className="text-white text-[13px] font-semibold leading-none">Pothole</p>
            <p className="text-slate-400 text-[11px] mt-1">Reported 12m ago</p>
          </div>
        </div>
        <p className="text-orange-400 text-[11px] mt-2 font-medium">• In Progress</p>
      </div>
    </div>

    {/* Box 2 - Middle Left - Sanitation */}
    <div className="absolute top-[52%] left-[-8%] z-30">
      <div className="bg-[#111a2f]/80 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 w-[210px] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-yellow-500/20 flex items-center justify-center text-[14px]">🚮</span>
          <div>
            <p className="text-white text-[13px] font-semibold leading-none">Sanitation</p>
            <p className="text-slate-400 text-[11px] mt-1">Reported 30m ago</p>
          </div>
        </div>
        <p className="text-yellow-400 text-[11px] mt-2 font-medium">• Pending</p>
      </div>
    </div>

    {/* Box 3 - Bottom Right - Water Leakage */}
    <div className="absolute bottom-[8%] right-[2%] z-30">
      <div className="bg-[#111a2f]/80 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 w-[210px] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center text-[14px]">💧</span>
          <div>
            <p className="text-white text-[13px] font-semibold leading-none">Water Leakage</p>
            <p className="text-slate-400 text-[11px] mt-1">Reported 1h ago</p>
          </div>
        </div>
        <p className="text-blue-400 text-[11px] mt-2 font-medium">• Assigned</p>
      </div>
    </div>

  </div>
</div>
             

              {/* Glowing Signal Nodes */}
              <div className="absolute top-1/4 left-1/4 w-2.5 h-2.5 bg-teal-400 rounded-full shadow-[0_0_10px_#22d3ee]"></div>
              <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_8px_#a855f7]"></div>
              <div className="absolute top-1/3 right-12 w-2 h-2 bg-teal-300 rounded-full shadow-[0_0_8px_#5eead4]"></div>
                      {/* Spark Moving on Arrow/Road */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1000 600" fill="none">
            {/* Yeh road ka path hai - white wavy arrow ko follow karega */}
            <path
              id="roadPath"
              d="M 350 120 Q 380 250 300 350 Q 250 420 450 520"
              stroke="transparent"
              strokeWidth="2"
              fill="none"
            />
            {/* Spark 1 */}
            <circle r="5" fill="#22d3ee" filter="url(#glow)">
              <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
                <mpath href="#roadPath" />
              </animateMotion>
            </circle>
            {/* Spark 2 - thoda delay se */}
            <circle r="4" fill="#a855f7" filter="url(#glow)">
              <animateMotion dur="3s" begin="0.8s" repeatCount="indefinite">
                <mpath href="#roadPath" />
              </animateMotion>
            </circle>
            {/* Glow filter */}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          </svg>
        </div>
            </div>
          </div>

        </section>
        
              

      <section id="how-it-works" className="bg-[#020a1a]">
        <HowItWorks />
      </section>
      
      <section id="authorities" className="bg-[#020a1a]">
        <Authorities />
      </section>

      <section id="about" className="bg-[#020a1a]">
        <About />
      </section>

      <section id="contact" className="bg-[#020a1a]">
        <Contact />
      </section>

   
    
 
      </div>
    </div>  

       
)
}

export default HomePage