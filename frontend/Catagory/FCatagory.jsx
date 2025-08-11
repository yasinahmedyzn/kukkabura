import {
  FaHeadphones,
  FaBluetooth,
  FaSpeakerDeck,
  FaBatteryFull,
  FaPlug,
  FaBolt,
  FaSyncAlt,
  FaLaptop,
  FaFan,
  FaMicrochip,
} from "react-icons/fa";
import {
  MdDock,
  MdOutlineHome,
  MdContentCut,
  MdBackpack,
  MdWatch,
} from "react-icons/md";

const categories = [
  { name: "Wired Earphone", icon: <FaHeadphones className="size-[20px] sm:size-[26px]" /> },
  { name: "Wireless Headset", icon: <FaBluetooth className="size-[20px] sm:size-[26px]" /> },
  { name: "Speakers", icon: <FaSpeakerDeck className="size-[20px] sm:size-[26px]" /> },
  { name: "Neckband", icon: <FaBatteryFull className="size-[20px] sm:size-[26px]" /> },
  { name: "Powerbank", icon: <FaBatteryFull className="size-[20px] sm:size-[26px]" /> },
  { name: "Power Adapter", icon: <FaPlug className="size-[20px] sm:size-[26px]" /> },
  { name: "Power Cable", icon: <FaBolt className="size-[20px] sm:size-[26px]" /> },
  { name: "Smartwatch", icon: <MdWatch className="size-[20px] sm:size-[26px]" /> },
  { name: "Converters", icon: <FaSyncAlt className="size-[20px] sm:size-[26px]" /> },
  { name: "Backpack", icon: <MdBackpack className="size-[20px] sm:size-[26px]" /> },
  { name: "Hubs & Docks", icon: <MdDock className="size-[20px] sm:size-[26px]" /> },
  { name: "Trimmer", icon: <MdContentCut className="size-[20px] sm:size-[26px]" /> },
  { name: "Home Appliance", icon: <MdOutlineHome className="size-[20px] sm:size-[26px]" /> },
  { name: "Laptop", icon: <FaLaptop className="size-[20px] sm:size-[26px]" /> },
  { name: "Fan", icon: <FaFan className="size-[20px] sm:size-[26px]" /> },
  { name: "Smart Gadgets", icon: <FaMicrochip className="size-[20px] sm:size-[26px]" /> },
];

export default function FeaturedCategories() {
  return (
    <div className="bg-white py-6">
      <div className="container mx-auto max-w-screen-xl px-4">
        {/* Header smaller for mobile */}
        <h2 className="text-center text-base sm:text-xl font-bold text-gray-800 mb-1">
          Featured Categories
        </h2>
        <p className="text-center text-green-600 text-xs sm:text-sm mb-6">
          Shop Your Desired Product from Featured Category
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-2 sm:p-4 border border-gray-300 rounded-md bg-white shadow-sm hover:shadow-md transition duration-200"
            >
              <div className="text-black mb-1 sm:mb-2">{cat.icon}</div>
              <p className="text-[9px] sm:text-xs text-center text-gray-800 font-medium">
                {cat.name}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 text-center">
          <a
            href="#"
            className="text-blue-600 text-xs sm:text-sm font-semibold hover:underline"
          >
            View All
          </a>
        </div>
      </div>
    </div>
  );
}
