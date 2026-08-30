export const isTokenExpired = (token) => {
  if (!token || typeof token !== "string") return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const decoded = JSON.parse(jsonPayload);
    if (decoded && typeof decoded.exp === "number") {
      return decoded.exp * 1000 <= Date.now();
    }
    return false;
  } catch {
    return true;
  }
};

export const saveToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("PharmacyAdmin", token);
    document.cookie = `rizipt-admin-token=${token}; path=/; max-age=864000; SameSite=Lax`;
    document.cookie = `PharmacyAdmin=${token}; path=/; max-age=864000; SameSite=Lax`;
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    let token = localStorage.getItem("PharmacyAdmin");

    if (!token) {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith("rizipt-admin-token=") || cookie.startsWith("PharmacyAdmin=")) {
          const val = cookie.split("=")[1];
          if (val) {
            token = val;
            break;
          }
        }
      }
    }

    if (token) {
      if (isTokenExpired(token)) {
        removeToken();
        return null;
      }
      localStorage.setItem("PharmacyAdmin", token);
      return token;
    }
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("PharmacyAdmin");
    document.cookie = "rizipt-admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    document.cookie = "PharmacyAdmin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
  }
};
