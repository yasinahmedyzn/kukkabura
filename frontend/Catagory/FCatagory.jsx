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
  { name: "Wired Earphone", icon: <FaHeadphones size={26} /> },
  { name: "Wireless Headset", icon: <FaBluetooth size={26} /> },
  { name: "Speakers", icon: <FaSpeakerDeck size={26} /> },
  { name: "Neckband", icon: <FaBatteryFull size={26} /> },
  { name: "Powerbank", icon: <FaBatteryFull size={26} /> },
  { name: "Power Adapter", icon: <FaPlug size={26} /> },
  { name: "Power Cable", icon: <FaBolt size={26} /> },
  { name: "Smartwatch", icon: <MdWatch size={26} /> },
  { name: "Converters", icon: <FaSyncAlt size={26} /> },
  { name: "Backpack", icon: <MdBackpack size={26} /> },
  { name: "Hubs & Docks", icon: <MdDock size={26} /> },
  { name: "Trimmer", icon: <MdContentCut size={26} /> },
  { name: "Home Appliance", icon: <MdOutlineHome size={26} /> },
  { name: "Laptop", icon: <FaLaptop size={26} /> },
  { name: "Fan", icon: <FaFan size={26} /> },
  { name: "Smart Gadgets", icon: <FaMicrochip size={26} /> },
];

export default function FeaturedCategories() {
  return (
    <div className="bg-white py-6">
      <div className="container mx-auto max-w-screen-xl px-4">
        <h2 className="text-center text-xl font-bold text-gray-800 mb-1">
          Featured Categories
        </h2>
        <p className="text-center text-green-600 text-sm mb-6">
          Shop Your Desired Product from Featured Category
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-md bg-white shadow-sm hover:shadow-md transition duration-200"
            >
              <div className="text-black mb-2">{cat.icon}</div>
              <p className="text-xs text-center text-gray-800 font-medium">
                {cat.name}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 text-center">
          <a
            href="#"
            className="text-blue-600 text-sm font-semibold hover:underline"
          >
            View All
          </a>
        </div>
      </div>
    </div>
  );
}
