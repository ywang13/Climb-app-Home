import React from "react";
import { Link, useLocation } from "wouter";
import { Home, User } from "lucide-react";

export default function BottomNavigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 max-w-md mx-auto">
      <div className="flex justify-around py-3">
        <Link href="/">
          <a className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            location === "/" 
              ? "text-blue-600 bg-blue-50" 
              : "text-gray-500 hover:text-gray-700"
          }`}>
            <Home size={24} />
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        
        <Link href="/profile">
          <a className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            location === "/profile" 
              ? "text-blue-600 bg-blue-50" 
              : "text-gray-500 hover:text-gray-700"
          }`}>
            <User size={24} />
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}