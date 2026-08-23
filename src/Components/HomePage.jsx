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

        {/* Navbar */}
        <nav className="flex items-center justify-between px-8 py-5">
          <h1 className="text-xl font-semibold">CivicRoute</h1>

          {/* Nav links */}
          <div className="hidden md:flex gap-8 text-sm text-gray-300">
            <a href="#" className="hover:text-white">How it works</a>
            <a href="#" className="hover:text-white">For Authorities</a>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-gray-300 hover:text-white">Log In</a>
            <button className="bg-teal-400 text-black text-sm font-medium px-4 py-2 rounded-md hover:bg-teal-300">
              Report an Issue
            </button>
          </div>
        </nav>

        {/* Hero section - TODO */}

      </div>
    </div>
  )
}

export default HomePage