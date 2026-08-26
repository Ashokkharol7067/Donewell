import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get("/auth/me")
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);
  async function authenticate(endpoint, details) {
    const { data } = await api.post(`/auth/${endpoint}`, details);
    setUser(data.user);
  }
  async function updateProfile(details) {
    const { data } = await api.patch("/auth/me", details);
    setUser(data.user);
    return data.user;
  }
  async function logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: (d) => authenticate("login", d),
        register: (d) => authenticate("register", d),
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
