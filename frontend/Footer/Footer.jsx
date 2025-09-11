import React from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 pt-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Store Image + Map */}
          <div className="grid grid-cols-2 gap-3">
            <img
              src="https://sp-ao.shortpixel.ai/client/to_auto,q_lossy,ret_img,w_512,h_288/https://www.flokq.com/blog/wp-content/uploads/2024/11/metro-department-store-1024x576.jpg"
              alt="Meiglow Store"
              className="rounded-lg w-full h-32 object-cover"
            />
            <iframe
              title="Dhaka Store Location"
              className="rounded-lg w-full h-32 border-0"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.9636549895024!2d90.412518!3d23.810331!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7ab7a5f3f8d%3A0x9f34b4f2f5b0b4e6!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1693609152718!5m2!1sen!2sbd"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>

          {/* Middle & Right - About & Help */}
          <div className="grid grid-cols-2 gap-6 lg:col-span-2">
            {/* About */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">About</h3>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="/about" className="hover:text-white">About Us</a></li>
                <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
                <li><a href="/terms" className="hover:text-white">Terms & Conditions</a></li>
              </ul>
            </div>

            {/* Help */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Help</h3>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li><a href="/returns" className="hover:text-white">Returns & Exchanges</a></li>
                <li><a href="/locator" className="hover:text-white">Store Locator</a></li>
                <li><a href="/career" className="hover:text-white">Career</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col items-center lg:flex-row lg:justify-between lg:items-center">
          {/* Social Icons */}
          <div className="flex justify-center gap-6 mb-4 lg:mb-0">
            <a href="https://www.facebook.com/share/1B7CwDU83E/" className="hover:text-white"><Facebook size={20} /></a>
            <a href="https://www.instagram.com/mei.glow?igsh=MW9wb216NGw5Ymc0bw==" className="hover:text-white"><Instagram size={20} /></a>
            <a href="#" className="hover:text-white"><Twitter size={20} /></a>
            <a href="https://www.youtube.com/@meiglowworld" className="hover:text-white"><Youtube size={20} /></a>
          </div>

          {/* Copyright */}
          <p className="text-sm sm:text-base font-medium text-gray-400 text-center">
            © {new Date().getFullYear()} Meiglow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
