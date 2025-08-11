import React from "react";
import { useCart } from "../src/context/CartContext";

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price ?? 0) * item.quantity,
    0
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <span>{item.name}</span>
              <span>{item.quantity} × ${item.price?.toFixed(2)}</span>
              <button
                className="text-red-500"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-4 font-bold">Total: ${totalPrice.toFixed(2)}</div>
          <button className="mt-2 bg-red-500 text-white px-4 py-2" onClick={clearCart}>
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;
