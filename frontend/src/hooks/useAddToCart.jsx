import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export function useAddToCart() {
  const { user } = useContext(AuthContext);
  const { addToCart } = useCart();

  const [toast, setToast] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [pendingProductId, setPendingProductId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (productId) => {
    if (!user) {
      setPendingProductId(productId);
      setShowLogin(true);
      return;
    }

    try {
      setLoading(true);
      await addToCart(productId, 1);
      setToast("Item added to cart successfully!");
      setTimeout(() => setToast(null), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setToast("Failed to add item to cart.");
      setTimeout(() => setToast(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async () => {
    setShowLogin(false);
    if (pendingProductId) {
      try {
        setLoading(true);
        await addToCart(pendingProductId, 1);
        setToast("Item added to cart successfully!");
        setPendingProductId(null);
        setTimeout(() => setToast(null), 2000);
      } catch (error) {
        console.error("Error adding pending item to cart:", error);
        setToast("Failed to add item to cart.");
        setTimeout(() => setToast(null), 2000);
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    toast,
    showLogin,
    setShowLogin,
    handleAddToCart,
    handleLoginSuccess,
    loading,
  };
}
