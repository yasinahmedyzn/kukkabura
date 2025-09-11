import React, { useEffect } from "react";
import { useCart } from "../src/context/CartContext";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import axios from "axios";

const CartPage = () => {
  const { items, loading, fetchCart, updateQty, remove, clearCart } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading cart...</p>;

  if (!items || items.length === 0)
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl font-bold mb-4">Your cart is empty 🛒</h2>
        <Link to="/" className="text-blue-500 underline hover:text-blue-700">
          Go shopping
        </Link>
      </div>
    );

  // Calculate subtotal correctly
  const subtotal = items.reduce((sum, item) => {
    const product = item.product || item.productId;
    if (!product) return sum;
    const hasDiscount = product.discountPrice && product.discountPrice < product.price;
    const price = hasDiscount ? product.discountPrice : product.price;
    return sum + price * (item.quantity || 1);
  }, 0);

  const handleProceedToPay = async () => {
    try {
      const customer = {
        name: "Test User",
        email: "test@example.com",
        phone: "01700000000",
        address: "123 Main Street",
        city: "Dhaka",
        postcode: "1207",
        country: "Bangladesh",
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/init`, {
        amount: subtotal.toFixed(2),
        tran_id: `txn_${Date.now()}`,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        customerAddress: customer.address,
        customerCity: customer.city,
        customerPostcode: customer.postcode,
        customerCountry: customer.country,
      });

      if (response.data.GatewayPageURL) {
        window.location.href = response.data.GatewayPageURL;
      } else {
        alert("Failed to initiate payment. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while initiating the payment.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">🛍 Your Cart</h1>

      <div className="space-y-4">
        {items.map((item) => {
          const product = item.product || item.productId;
          if (!product) return null;

          const hasDiscount = product.discountPrice && product.discountPrice < product.price;
          const pricePerItem = hasDiscount ? product.discountPrice : product.price;
          const totalPrice = pricePerItem * (item.quantity || 1);

          return (
            <div
              key={item._id || product._id}
              className="flex flex-col md:flex-row justify-between items-center border rounded-lg p-4 shadow-sm bg-white"
            >
              {/* Product Info */}
              <div className="flex items-center space-x-4 w-full md:w-1/2">
                <img
                  src={product.images?.[0]?.url || "/placeholder.jpg"}
                  alt={product.name || "Product"}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-semibold text-lg">{product.name || "Unnamed Product"}</h3>
                  <p className="text-gray-500">
                    {hasDiscount ? (
                      <>
                        <span className="line-through mr-1">৳ {product.price}</span>
                        <span className="text-red-600 font-bold">৳ {product.discountPrice}</span>
                        {product.discountPercentage && (
                          <span className="ml-1 text-xs text-red-500">(-{product.discountPercentage}%)</span>
                        )}
                      </>
                    ) : (
                      <>৳ {product.price || 0}</>
                    )}
                  </p>
                </div>
              </div>

              {/* Quantity & Price */}
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() =>
                      updateQty(product._id, Math.max(1, (item.quantity || 1) - 1))
                    }
                    className="p-2 hover:bg-gray-100"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4">{item.quantity || 1}</span>
                  <button
                    onClick={() => updateQty(product._id, (item.quantity || 1) + 1)}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <p className="font-bold text-gray-700">৳ {totalPrice}</p>

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
          <span>৳ {subtotal}</span>
        </div>

        <div className="mt-4 flex flex-col space-y-2">
          <button
            onClick={handleProceedToPay}
            className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 w-full"
          >
            Proceed to Checkout
          </button>
          <button
            onClick={clearCart}
            className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 w-full"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
