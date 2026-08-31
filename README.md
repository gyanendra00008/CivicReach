<div align="center">

# 🏛️ CivicReach — Smart Civic Grievance Redressal & Authority Routing Platform

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Smart India Hackathon](https://img.shields.io/badge/SIH-Project-FF9933?style=for-the-badge&logoColor=white)](https://www.sih.gov.in/)

<p align="center">
  <strong>An AI-powered, Geolocation-driven Civic Issue Reporting, Intelligent Department Routing, and Real-Time Redressal Ecosystem.</strong>
</p>

[Key Features](#-key-features) • [System Architecture](#-system-architecture) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start--installation) • [API Documentation](#-api-endpoints) • [Deployment](#-deployment-guide)

</div>

---

## 📌 Overview

**CivicReach** is a modern civic governance platform designed to revolutionize the way citizens report public grievances and municipal authorities resolve them. By integrating **automated reverse geocoding**, **intelligent department-level complaint routing**, and **dual-token cryptographic authentication**, CivicReach removes bureaucratic delays and ensures high-transparency governance.

Whether it's a pothole, a street light outage, water contamination, or sanitation negligence, CivicReach automatically identifies the user's district and pincode, categorizes the grievance, and directly delivers it to the administrative portal of the responsible local authority.

---

## ✨ Key Features

### 👤 Citizen Portal
- **📍 Auto-GPS Geolocation & Reverse Geocoding**: Automatically determines District, State, City, and Pincode using OpenStreetMap Nominatim integration.
- **📸 Multi-Format Issue Reporting**: Upload grievance details with real-time base64 image proof, problem category, and exact location mapping.
- **📊 Real-Time Grievance Tracker**: Monitor complaint lifecycle status in real time (`Pending` ⏳ ➔ `In-Review` 🔍 ➔ `Resolved` ✅).
- **🔐 Secure Authentication & OTP Verification**: High-security citizen accounts with email verification and dual-factor OTP authorization via Brevo / Resend / Nodemailer.
- **📱 Responsive Cyberpunk UI**: Sleek dark-mode aesthetic built with Tailwind CSS v4, smooth animations, and glassmorphism.

### 🛡️ Municipal & Authority Portal
- **🎯 Intelligent Department & District Filtering**: Authority dashboard automatically pulls grievances matching the official's specific District and Department (e.g., *Electricity, Sanitation, Water Supply, Road Infrastructure*).
- **⚡ Instant Status Lifecycle Management**: Single-click status updates (`Pending` ➔ `In-Review` ➔ `Resolved`) with instantaneous frontend UI sync.
- **🔍 Deep Search & Pincode Lookup**: Filter issues across multiple municipal zones, pincodes, and urgency levels.
- **🖼️ Image Evidence Viewer**: Inspect high-resolution photo evidence submitted by citizens directly from an interactive modal.

### ⚙️ Backend & Data Engine
- **🚀 Dual Microservices Architecture**:
  - **FastAPI (Python 3)**: Blazing-fast geo-computation, Nominatim geocoding, and high-throughput complaint routing.
  - **Express.js (Node.js)**: JWT authentication engine, password hashing with Bcrypt, and email notification pipeline.
- **🍃 MongoDB Document Aggregation**: Advanced MongoDB aggregation pipelines for instant sub-document unwinding, multi-criteria filtering, and geo-indexed storage.

---

## 🏗️ System Architecture

```
                                  ┌────────────────────────────────┐
                                  │       Client Browser (UI)      │
                                  │   React 19 + Tailwind CSS +    │
                                  │       Lucide Icons + Vite      │
                                  └───────────────┬────────────────┘
                                                  │
                         ┌────────────────────────┴────────────────────────┐
                         │                                                 │
                         ▼                                                 ▼
        ┌──────────────────────────────────┐             ┌──────────────────────────────────┐
        │       Auth & Identity Service    │             │      Civic Engine & Geo API      │
        │      (Node.js + Express + JWT)   │             │       (FastAPI + Python 3)       │
        │               Port 5000          │             │             Port 8000            │
        └────────────────┬─────────────────┘             └────────┬─────────────────┬───────┘
                         │                                        │                 │
                         │                                        │                 ▼
                         │                                        │     ┌───────────────────────┐
                         │                                        │     │ OpenStreetMap API     │
                         │                                        │     │ (Reverse Geocoding)   │
                         │                                        │     └───────────────────────┘
                         ▼                                        ▼
        ┌───────────────────────────────────────────────────────────────────┐
        │                     MongoDB Atlas (Database)                      │
        │   - Users & Auth Collection         - Problems & Geo Collection   │
        └───────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide React, React Router v7, React Hook Form, Redux Toolkit |
| **Auth Microservice** | Node.js, Express.js 5, JSON Web Token (JWT), Bcrypt, Nodemailer, Brevo API, Resend |
| **Core API & Routing** | Python 3, FastAPI, Uvicorn, PyMongo, Pydantic v2, Requests |
| **Database** | MongoDB Atlas / MongoDB Local |
| **External APIs** | OpenStreetMap Nominatim Geocoding API |
| **DevOps & Tooling** | Oxlint, PostCSS, Autoprefixer, Git |
| **Deployment Targets** | Vercel (Frontend), Render (Node.js & FastAPI Web Services) |

---

## 📁 Repository Structure

```text
CivicReach/
├── authentication/              # 🔐 Node.js & Express Authentication Microservice
│   ├── src/
│   │   ├── controller/          # Auth controllers (login, signup, OTP, password reset)
│   │   ├── db/                  # Mongoose MongoDB connection
│   │   ├── model/               # User and Authority Mongoose schemas
│   │   ├── routes/              # Express API authentication routes
│   │   ├── services/            # Email & OTP delivery services (Brevo / Resend / Nodemailer)
│   │   └── app.js               # Express application config & middleware
│   ├── server.js                # Auth server entry point
│   ├── package.json             # Auth dependencies & scripts
│   └── .env.example             # Auth environment variable template
│
├── Backend/                     # 🚀 Python FastAPI Civic Engine & Geolocation Microservice
│   ├── Services/
│   │   └── maps.py              # Geocoding and map utilities
│   ├── main.py                  # FastAPI application, routing, and MongoDB aggregations
│   ├── requirements.txt         # Python dependencies
│   └── .env.example             # FastAPI environment variable template
│
├── src/                         # 🎨 React 19 Frontend Application
│   ├── assets/                  # Images, illustrations, and icons
│   ├── Components/              # React UI Components
│   │   ├── HomePage.jsx         # Landing page with hero & navigation
│   │   ├── UploadPage.jsx       # Complaint submission with GPS & photo upload
│   │   ├── ComplaintPage.jsx    # Citizen grievance tracking dashboard
│   │   ├── AuthorityDashboard.jsx # Departmental complaint resolution dashboard
│   │   ├── UserAuth.jsx         # Citizen Login
│   │   ├── UserSignup.jsx       # Citizen Registration
│   │   ├── AuthorityAuth.jsx    # Authority Login
│   │   ├── AuthoritySignup.jsx  # Authority Registration
│   │   ├── OtpVerify.jsx        # OTP Verification modal
│   │   └── ...                  # Modals, About, Contact, Navigation components
│   ├── Utilities/               # Helper utilities (JWT authFetch, Geolocation)
│   ├── App.jsx                  # React Router Route definitions
│   ├── config.js                # Dynamic backend API URL configurations
│   ├── main.jsx                 # Frontend entry point
│   └── index.css                # Global CSS & Tailwind styling
│
├── public/                      # Static assets
├── DEPLOYMENT.md                # Render & Vercel deployment manual
├── vite.config.js               # Vite bundler configuration
└── package.json                 # Frontend scripts & dependencies
```

---


## 🤝 Contributing

Contributions are what make the open-source community an amazing place to learn, inspire, and create!

1. **Fork** the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

---

## 👥 Authors & Acknowledgements

- **CivicReach Team** — Built with passion for **Smart India Hackathon (SIH)**.
- Reverse geocoding provided by [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/).
- Icons and UI components powered by [Lucide React](https://lucide.dev/) and [Tailwind CSS](https://tailwindcss.com/).

<div align="center">
  <sub>Made with ❤️ for Smarter Cities & Empowered Citizens.</sub>
</div>
