// CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/Api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const cartCount = items.reduce((sum, i) => sum + (i.quantity || 1), 0);

  // Fetch cart (user or guest)
  const fetchCart = async () => {
    if (user && token) {
      try {
        setLoading(true);
        const res = await api.get("/api/cart", { headers: { Authorization: `Bearer ${token}` } });
        setItems(res.data.items || []);
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
      setItems(guestCart);
    }
  };

  // Merge guest cart on login
  useEffect(() => {
    window.mergeGuestCart = async (guestItems) => {
      if (!user || !token || guestItems.length === 0) return;

      for (const item of guestItems) {
        try {
          await api.post("/api/cart", { productId: item.productId, quantity: item.quantity }, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          console.error(err);
        }
      }

      fetchCart(); // refresh immediately
    };

    return () => { window.mergeGuestCart = null; };
  }, [user, token]);

  const addToCart = async (product, quantity = 1) => {
    if (user && token) {
      try {
        const res = await api.post("/api/cart", { productId: product._id, quantity }, { headers: { Authorization: `Bearer ${token}` } });
        setItems(res.data.items || []);
      } catch (err) {
        console.error(err);
      }
    } else {
      setItems(prev => {
        const exist = prev.find(i => i.productId === product._id);
        let updated;
        if (exist) {
          updated = prev.map(i => i.productId === product._id ? { ...i, quantity: i.quantity + quantity } : i);
        } else {
          updated = [...prev, { productId: product._id, product, quantity }];
        }
        localStorage.setItem("guest_cart", JSON.stringify(updated));
        return updated;
      });
    }
  };

  const updateQty = async (productId, quantity) => {
    if (user && token) {
      try {
        const res = await api.put(`/api/cart/${productId}`, { quantity }, { headers: { Authorization: `Bearer ${token}` } });
        setItems(res.data.items || []);
      } catch (err) { console.error(err); }
    } else {
      const updated = items.map(i => i.productId === productId ? { ...i, quantity } : i);
      setItems(updated);
      localStorage.setItem("guest_cart", JSON.stringify(updated));
    }
  };

  const remove = async (productId) => {
    if (user && token) {
      try {
        const res = await api.delete(`/api/cart/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
        setItems(res.data.items || []);
      } catch (err) { console.error(err); }
    } else {
      const updated = items.filter(i => i.productId !== productId);
      setItems(updated);
      localStorage.setItem("guest_cart", JSON.stringify(updated));
    }
  };

  const clearCart = () => {
    setItems([]);
    if (!user) localStorage.removeItem("guest_cart");
  };

  useEffect(() => { fetchCart(); }, [user]);

  return (
    <CartContext.Provider value={{ items, cartCount, loading, fetchCart, addToCart, updateQty, remove, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
