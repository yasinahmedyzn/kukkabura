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

  // Fetch images
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

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  // Swipe support
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
    trackMouse: true, // enables desktop swipe
  });

  return (
    <div className="max-w-7xl mx-auto mt-8 rounded-2xl shadow-lg relative">
      {/* Swipeable viewport */}
      <div
        {...swipeHandlers}
        className="overflow-hidden select-none" // select-none prevents text/image selection
      >
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Slide ${idx + 1}`}
              draggable="false" // stops browser from dragging image
              className="w-full flex-shrink-0 object-cover h-[400px] pointer-events-none"
            />
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 backdrop-blur-md rounded-full px-4 py-2 flex space-x-3">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-3 w-3 rounded-full transition-colors ${
              idx === currentIndex ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
