import { useEffect, useState } from "react";
import axios from "axios";
import { useSwipeable } from "react-swipeable";

const defaultImages = [
  "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80",
  "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2762&q=80",
];

export default function Carousel() {
  const [images, setImages] = useState(defaultImages);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch images from API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/carousel-images`
        );
        if (res.data?.length > 0) {
          setImages(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch images:", error);
      }
    };
    fetchImages();
  }, []);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  // Swipe support for mobile & desktop
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () =>
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      ),
    onSwipedRight: () =>
      setCurrentIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      ),
    preventScrollOnSwipe: true,
    trackMouse: true, // enables swipe with mouse on desktop
  });

  return (
    <div className="max-w-7xl mx-auto mt-8 rounded-2xl shadow-lg relative">
      {/* Swipeable container */}
      <div {...swipeHandlers} className="overflow-hidden select-none">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Slide ${idx + 1}`}
              draggable="false"
              className={`
                w-full flex-shrink-0 object-cover pointer-events-none
                /* Mobile view height */
                h-[180px]
                /* Tablet view height */
                sm:h-[250px]
                /* Medium desktop height */
                md:h-[350px]
                /* Large desktop height */
                lg:h-[400px]
              `}
            />
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div
        className={`
          absolute left-1/2 transform -translate-x-1/2 backdrop-blur-md rounded-full flex
          /* Mobile view positioning & size */
          bottom-2 px-2 py-1 space-x-2
          /* Desktop view positioning & size */
          sm:bottom-4 sm:px-4 sm:py-2 sm:space-x-3
        `}
      >
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`
              rounded-full transition-colors
              /* Mobile dot size */
              h-2 w-2
              /* Desktop dot size */
              sm:h-3 sm:w-3
              ${idx === currentIndex ? "bg-blue-600" : "bg-gray-300"}
            `}
          />
        ))}
      </div>
    </div>
  );
}
