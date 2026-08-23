import React from 'react'
import bg from '../assets/map-bg.jpg'

const HomePage = () => {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative text-white"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 flex flex-col min-h-screen">

      <nav className="mx-4 md:mx-8 mt-4 flex items-center justify-between px-6 py-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
  {/* Logo with icon */}
  <div className="flex items-center gap-2">
    <span className="text-2xl">📍</span>
    <h1 className="text-xl font-bold">CivicRoute</h1>
  </div>

  {/* Nav links */}
  <div className="hidden md:flex gap-6 text-sm text-gray-300">
    <a href="#" className="text-teal-400 border-b-2 border-teal-400 pb-1">Home</a>
    <a href="#" className="hover:text-white">How it Works</a>
    <a href="#" className="hover:text-white">Authorities</a>
    <a href="#" className="hover:text-white">About</a>
    <a href="#" className="hover:text-white">Contact</a>
  </div>

  {/* Badge */}
  {/* Auth buttons */}
<div className="flex items-center gap-4">
<button className="bg-teal-400 text-black text-sm font-medium px-4 py-2 rounded-md hover:bg-teal-300">
    Track Complaint </button>
  <button className="bg-teal-400 text-black text-sm font-medium px-4 py-2 rounded-md hover:bg-teal-300">
    Report an Issue
  </button>
</div>
</nav>


        

       
        {/* Hero section */}
<section className="flex-1 flex items-center justify-center px-8 md:px-16">
  <div className="max-w-2xl text-center">

    {/* Main heading */}
    <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
      Every complaint,{' '}
      <span className="text-teal-400">routed to the right desk.</span>
    </h2>

    {/* Description */}
    <p className="text-gray-300 mb-8">
      Pin the problem on the map, and CivicRoute finds the exact
      authority responsible — no more complaints lost between departments.
    </p>

    {/* CTA buttons */}
    <div className="flex gap-4 justify-center">
      <button className="bg-teal-400 text-black font-medium px-5 py-3 rounded-md hover:bg-teal-300">
        File a Complaint
      </button>
      <button className="border border-gray-400 text-white px-5 py-3 rounded-md hover:bg-white/10">
        Authority Login
      </button>
    </div>
  </div>
</section>

      </div>
    </div>
  )
}

export default HomePage