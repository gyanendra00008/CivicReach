const rawAuthUrl =
  import.meta.env.VITE_AUTH_API_URL || "https://civicreach.onrender.com";

export const AUTH_API_URL = rawAuthUrl.replace(/\/+$/, "");

const rawFastApiUrl =
  import.meta.env.VITE_FASTAPI_API_URL ||
  "https://backend-and-database.onrender.com";

export const FASTAPI_API_URL = rawFastApiUrl.replace(/\/+$/, "");


