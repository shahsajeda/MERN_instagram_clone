// src/components/Navbar.jsx
import React from "react";
import { AiOutlineHome } from "react-icons/ai";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { Link } from "react-router-dom";


const Navbar = () => {
  return (
    <nav className="fixed left-0 top-0 h-full w-60 bg-white border-r border-gray-300 p-4 flex flex-col justify-between z-50">
      {/* Top: Logo and menu */}
      <div>
        {/* Instagram Logo */}
        <div className="mb-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2560px-Instagram_logo.svg.png"
            alt="Instagram"
            className="h-10 cursor-pointer"
          />
        </div>

        {/* Menu Items */}
        <ul className="space-y-6">
          <li className="flex items-center space-x-4 cursor-pointer hover:text-blue-500">
  <BiMessageRoundedDetail className="h-6 w-6" />
  <Link to="/home" className="text-lg">Home</Link>
</li>
          <li className="flex items-center space-x-4 cursor-pointer hover:text-blue-500">
            <BiMessageRoundedDetail className="h-6 w-6" />
             <Link to="/chat" className="text-lg">Message</Link>
          </li>
          <li className="flex items-center space-x-4 cursor-pointer hover:text-blue-500">
  <BiMessageRoundedDetail className="h-6 w-6" />
  <Link to="/upload" className="text-lg">Upload POST</Link>
</li>
 <li className="flex items-center space-x-4 cursor-pointer hover:text-blue-500">
  <BiMessageRoundedDetail className="h-6 w-6" />
  <Link to="/profile" className="text-lg">Profile</Link>
 
</li>
        </ul>
      </div>

      {/* Bottom: Profile image placeholder */}
               
    </nav>
  );
};

export default Navbar;
