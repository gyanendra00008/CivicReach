import { AUTH_API_URL } from "../config";

/**
 * Performs a fetch request to the authentication service or FastAPI backend.
 * Automatically adds Authorization header and handles refreshing tokens if expired.
 */
export async function authFetch(url, options = {}) {
  options.headers = options.headers || {};
  
  // Set credentials to include so that refreshToken cookies are sent
  options.credentials = "include";

  // Add application/json content type if body is present and not form data
  if (options.body && typeof options.body === "string" && !options.headers["Content-Type"]) {
    options.headers["Content-Type"] = "application/json";
  }

  // Get current access token
  let token = localStorage.getItem("accessToken");
  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    let response = await fetch(url, options);

    // If unauthorized, token might be expired
    if (response.status === 401) {
      // Check if it's token expired/invalid message
      const data = await response.clone().json().catch(() => ({}));
      if (
        data.message === "Token expired" || 
        data.message === "Token not found" || 
        data.message === "Invalid token" ||
        data.message === "Invalid or expired refresh token"
      ) {
        // Attempt to refresh the token
        const refreshSuccess = await refreshAccessToken();
        if (refreshSuccess) {
          // Retry the request with the new token
          token = localStorage.getItem("accessToken");
          if (token) {
            options.headers["Authorization"] = `Bearer ${token}`;
          } else {
            delete options.headers["Authorization"];
          }
          response = await fetch(url, options);
        } else {
          // Refresh failed, token is invalid, trigger logout
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

/**
 * Attempts to refresh the access token using the refresh token cookie.
 */
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

/**
 * Calls the logout endpoint on the backend and clears client session data.
 */
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

/**
 * Clears all auth session data from localStorage.
 */
export function clearSession() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  localStorage.removeItem("authority");
}
