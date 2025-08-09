"use client"

import { useState } from "react"
import { Heart, ShoppingCart } from "lucide-react"

const products = [
  {
    id: 1,
    brand: "Herlan",
    name: "Galactic Glam Lip Gloss – Meteor Magic",
    originalPrice: 1350,
    discountedPrice: 540,
    image: "https://herlan.com/wp-content/uploads/2024/10/1-Galactic-Glam-Lip-Gloss-Supernova-Sizzle-800x800.webp",
    hoverImage: "https://herlan.com/wp-content/uploads/2024/10/Lipgloss__Swatch_Solo_Sizzle.webp",
  },
  {
    id: 2,
    brand: "Herlan",
    name: "Herlan Cushion Matte Lipstick Flaming Hot",
    originalPrice: 1550,
    discountedPrice: 620,
    image: "https://herlan.com/wp-content/uploads/2023/10/Herlan-Nail-Enamel-Front-Bridesmaid-990x990-1-800x800.png",
    hoverImage: "https://herlan.com/wp-content/uploads/2024/03/Brides-Maid-800x800.jpg",
  },
  {
    id: 3,
    brand: "Herlan",
    name: "Herlan Cushion Matte Lipstick Disco Diva",
    originalPrice: 1550,
    discountedPrice: 620,
    image: "https://herlan.com/wp-content/uploads/2023/10/Rosaline-1-800x800.jpg",
    hoverImage: "https://herlan.com/wp-content/uploads/2024/03/Roseline-2.jpg",
  },
  {
    id: 4,
    brand: "Herlan",
    name: "Galactic Glam Holographic Lip Gloss – Galaxy Glitz",
    originalPrice: 1350,
    discountedPrice: 540,
    image: "https://herlan.com/wp-content/uploads/2023/12/1-Herlan-Cushion-Matte-Lipstick-Roaring-Twenties-800x800.webp",
    hoverImage: "https://herlan.com/wp-content/uploads/2023/12/2-Herlan-Cushion-Matte-Lipstick-Roaring-Twenties.webp",
  },
  {
    id: 5,
    brand: "Herlan",
    name: "Herlan Cushion Matte Lipstick Retrograde Blue",
    originalPrice: 1550,
    discountedPrice: 620,
    image: "https://herlan.com/wp-content/uploads/2023/12/1-Herlan-Cushion-Matte-Lipstick-Retrograde-Blue-800x800.webp",
    hoverImage: "https://herlan.com/wp-content/uploads/2023/12/2-Herlan-Cushion-Matte-Lipstick-Retrograde-Blue.webp",
  },
]

export default function DiscountedProduct() {
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const [favorites, setFavorites] = useState(new Set())

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId)
    } else {
      newFavorites.add(productId)
    }
    setFavorites(newFavorites)
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Up To 60% Off</h2>
        <button className="text-sm text-gray-600 hover:text-gray-900 underline">View all</button>
      </div>

      {/* Products Container */}
      <div className="relative">
        {/* Desktop: Show all 5 products */}
        <div className="hidden md:grid md:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isHovered={hoveredProduct === product.id}
              isFavorite={favorites.has(product.id)}
              onHover={() => setHoveredProduct(product.id)}
              onLeave={() => setHoveredProduct(null)}
              onToggleFavorite={() => toggleFavorite(product.id)}
            />
          ))}
        </div>

        {/* Mobile: Horizontal scroll showing 2 products */}
        <div className="md:hidden overflow-x-auto">
          <div className="flex gap-4 pb-4" style={{ width: `${products.length * 180}px` }}>
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-40">
                <ProductCard
                  product={product}
                  isHovered={hoveredProduct === product.id}
                  isFavorite={favorites.has(product.id)}
                  onHover={() => setHoveredProduct(product.id)}
                  onLeave={() => setHoveredProduct(null)}
                  onToggleFavorite={() => toggleFavorite(product.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product, isHovered, isFavorite, onHover, onLeave, onToggleFavorite }) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-3 md:p-4 relative group hover:shadow-md transition-shadow duration-200">
      {/* Wishlist Heart */}
      <button
        onClick={onToggleFavorite}
        className="absolute top-2 right-2 z-10 p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"}`} />
      </button>

      {/* Product Image with Hover Effect */}
      <div className="relative mb-3 cursor-pointer" onMouseEnter={onHover} onMouseLeave={onLeave}>
        <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden relative">
          {/* Main Image */}
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          />
          {/* Hover Image */}
          <img
            src={product.hoverImage || "/placeholder.svg"}
            alt={`${product.name} - alternate view`}
            className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-gray-900">{product.brand}</p>
        <h3 className="text-xs md:text-sm text-gray-700 line-clamp-2 leading-tight">{product.name}</h3>

        {/* Price and Buy Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 line-through">₹ {product.originalPrice}</span>
            <span className="text-sm font-semibold text-red-600">₹ {product.discountedPrice}</span>
          </div>
          <button className="p-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors">
            <ShoppingCart className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
