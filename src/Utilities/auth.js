import { AUTH_API_URL } from "../config";
export async function authFetch(url, options = {}) {
  options.headers = options.headers || {};
  options.credentials = "include";

 
  if (options.body && typeof options.body === "string" && !options.headers["Content-Type"]) {
    options.headers["Content-Type"] = "application/json";
  }

 
  let token = localStorage.getItem("accessToken");
  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    let response = await fetch(url, options);


    if (response.status === 401) {

      const data = await response.clone().json().catch(() => ({}));
      if (
        data.message === "Token expired" || 
        data.message === "Token not found" || 
        data.message === "Invalid token" ||
        data.message === "Invalid or expired refresh token"
      ) {

        const refreshSuccess = await refreshAccessToken();
        if (refreshSuccess) {

          token = localStorage.getItem("accessToken");
          if (token) {
            options.headers["Authorization"] = `Bearer ${token}`;
          } else {
            delete options.headers["Authorization"];
          }
          response = await fetch(url, options);
        } else {

          clearSession();
        }
      }
    }

    return response;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}

export async function refreshAccessToken() {
  try {
    const response = await fetch(`${AUTH_API_URL}/api/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const result = await response.json();
      if (result.accessToken) {
        localStorage.setItem("accessToken", result.accessToken);
        return true;
      }
    }
    return false;
  } catch (err) {
    console.error("Failed to refresh token:", err);
    return false;
  }
}

export async function logoutUser() {
  try {
    await fetch(`${AUTH_API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Logout API call failed:", err);
  } finally {
    clearSession();
  }
}

export function clearSession() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  localStorage.removeItem("authority");
}
