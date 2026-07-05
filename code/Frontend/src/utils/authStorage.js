const USER_KEY = "user";

export function saveAuth({ token, user, rememberMe = true }) {
  const storage = rememberMe ? localStorage : sessionStorage;
  const other = rememberMe ? sessionStorage : localStorage;

  other.removeItem("token");
  other.removeItem(USER_KEY);

  storage.setItem("token", token);
  if (user) {
    storage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getUserRole() {
  return getStoredUser()?.role ?? null;
}

export function clearAuth() {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export async function refreshStoredUser() {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) {
    return null;
  }

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  try {
    const response = await fetch(`${apiUrl}/api/v1/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    if (!response.ok || !data.success || !data.data?.user) {
      return getStoredUser();
    }

    const user = {
      id: data.data.user._id || data.data.user.id,
      userName: data.data.user.userName,
      email: data.data.user.email,
      accountType: data.data.user.accountType,
      role: data.data.user.role,
      isVerified: data.data.user.isVerified,
      firstName: data.data.user.firstName,
      lastName: data.data.user.lastName,
    };

    const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
    storage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  } catch {
    return getStoredUser();
  }
}
