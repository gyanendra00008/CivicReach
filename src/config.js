const rawAuthUrl =
  import.meta.env.VITE_AUTH_API_URL || "https://civicreach.onrender.com";

export const AUTH_API_URL = rawAuthUrl.replace(/\/+$/, "");
