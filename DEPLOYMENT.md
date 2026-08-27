# 🚀 CivicReach - Render & Vercel Deployment Guide

Sabhi configurations Render aur Vercel ke liye set kar di gayi hain. Niche diye gaye simple steps follow karein:

---

## 1️⃣ Part A: Deploy Backend on Render

1. Open [Render Dashboard](https://dashboard.render.com/) aur **New +** -> **Web Service** par click karein.
2. Apna GitHub repository `CivicReach` select karein.
3. Settings enter karein:
   - **Name**: `civicreach-backend` (ya jo aap chahein)
   - **Region**: Singapore (ya nearest)
   - **Branch**: `main`
   - **Root Directory**: `authentication` *(Zaroori)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

4. **Environment Variables** (Environment tab me add karein):
   | Key | Value | Description |
   |-----|-------|-------------|
   | `NODE_ENV` | `production` | Production mode |
   | `MONGODB_URI` | `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/authentication?retryWrites=true&w=majority` | Aapka MongoDB Atlas connection string |
   | `JWT_SECRET` | `your_secret_key_here` | Any long random string |
   | `CLIENT_URL` | `https://your-frontend-name.vercel.app` | Aapka Vercel frontend URL |
   | `EMAIL_USER` | `your_email@gmail.com` *(Optional)* | Gmail address OTP bhejne ke liye |
   | `EMAIL_PASS` | `your_16_digit_app_password` *(Optional)* | Google App Password |

> 💡 **Tip:** Agar Gmail credentials set nahi kiye hain, tab bhi OTP **123456** fallback se login/verify ho jayega!
> 
> ⚠️ **MongoDB Atlas IP Whitelist:** MongoDB Atlas -> *Network Access* me jakar **0.0.0.0/0** (Allow Access from Anywhere) add karein taki Render connect ho sake.

5. Click **Deploy Web Service**. Deploy hone ke baad Render aapko ek URL dega (Jaise `https://civicreach-backend.onrender.com`).
   - Browser me is URL par jayein. Aapko dikhega: `{"status":"success","message":"Server is running smoothly! 🚀"}`

---

## 2️⃣ Part B: Deploy Frontend on Vercel

1. Open [Vercel Dashboard](https://vercel.com/dashboard) aur **Add New...** -> **Project** par click karein.
2. Apna GitHub repository `CivicReach` import karein.
3. Project configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (Default root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables** (Vercel project settings me add karein):
   | Key | Value |
   |-----|-------|
   | `VITE_AUTH_API_URL` | Render backend ka URL (Jaise `https://civicreach-backend.onrender.com`) |

5. Click **Deploy**.
6. Deployment complete hone ke baad Vercel aapka live link dega (Jaise `https://civicreach.vercel.app`).

---

## 3️⃣ Part C: Final Link-up

1. Render Dashboard me jayein -> apne Web Service ke **Environment** tab me `CLIENT_URL` me Vercel ka actual URL daal dein (`https://civicreach.vercel.app`).
2. Done! Frontend aur Backend successfully connected hain! 🎉
