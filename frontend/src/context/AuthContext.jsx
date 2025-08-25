// AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = (userData, jwtToken, guestCartItems = []) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwtToken);
    setUser(userData);
    setToken(jwtToken);

    // Merge guest cart immediately
    if (guestCartItems.length && window.mergeGuestCart) {
      window.mergeGuestCart(guestCartItems);
      localStorage.removeItem("guest_cart");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
