import React, { useEffect } from "react";
import { useCart } from "../src/context/CartContext";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";

const CartPage = () => {
  const { items, loading, fetchCart, updateQty, remove, clearCart } = useCart();

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => {
    const product = item.product || item.productId; // guest or logged-in
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading cart...</p>;

  if (items.length === 0)
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl font-bold mb-4">Your cart is empty 🛒</h2>
        <Link
          to="/"
          className="text-blue-500 underline hover:text-blue-700 transition"
        >
          Go shopping
        </Link>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">🛍 Your Cart</h1>

      {/* Cart Items */}
      <div className="space-y-4">
        {items.map((item) => {
          const product = item.product || item.productId;
          if (!product) return null;

          // Use a unique key for guests
          const key = item._id || `guest-${product._id}`;

          return (
            <div
              key={key}
              className="flex flex-col md:flex-row justify-between items-center border rounded-lg p-4 shadow-sm bg-white"
            >
              {/* Product Info */}
              <div className="flex items-center space-x-4 w-full md:w-1/2">
                <img
                  src={product.image || product.imageUrl || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-gray-500">${product.price}</p>
                </div>
              </div>

              {/* Quantity & Price */}
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() =>
                      updateQty(product._id, Math.max(1, item.quantity - 1))
                    }
                    className="p-2 hover:bg-gray-100"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(product._id, item.quantity + 1)}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <p className="font-bold text-gray-700">
                  ${(product.price || 0) * item.quantity}
                </p>

                <button
                  onClick={() => remove(product._id)}
                  className="text-red-500 hover:bg-red-100 p-2 rounded-full"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Summary */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md border md:w-1/3 md:ml-auto">
        <h2 className="text-lg font-bold mb-4">🧾 Order Summary</h2>
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="mt-4 flex flex-col space-y-2">
          <button className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
            Proceed to Checkout
          </button>
          <button
            onClick={clearCart}
            className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
