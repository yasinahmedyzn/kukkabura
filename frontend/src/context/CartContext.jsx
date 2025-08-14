import React, { createContext, useContext, useState } from "react";
import api from "../api/api"; // Your axios instance

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Automatically calculate cart count
  const cartCount = items.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  // ✅ Fetch cart from backend
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/cart");
      setItems(res.data.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await api.post("/api/cart", { productId, quantity });
      setItems(res.data.items || []);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

// ✅ Update quantity
const updateQty = async (productId, quantity) => {
  try {
    // Use PUT request to update quantity
    const res = await api.put(`/api/cart/${productId}`, { quantity });
    setItems(res.data.items || []); // Update cart with fresh backend data
  } catch (err) {
    console.error("Error updating quantity:", err);
  }
};

  // ✅ Remove item
  const remove = async (productId) => {
    try {
      const res = await api.delete(`/api/cart/${productId}`);
      setItems(res.data.items || []);
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  // ✅ Clear cart (for logout)
  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,  // ✅ Navbar will now see this
        loading,
        fetchCart,
        addToCart,
        updateQty,
        remove,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart context
export const useCart = () => useContext(CartContext);
