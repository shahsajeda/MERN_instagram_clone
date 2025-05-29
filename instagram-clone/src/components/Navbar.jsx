// src/components/Navbar.jsx
import React, { useState } from "react";
import { AiOutlineHome, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { BsChatDots } from "react-icons/bs";
import { FiUpload } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navItems = [
    { icon: <AiOutlineHome className="h-6 w-6" />, label: "Home", path: "/home" },
    { icon: <BsChatDots className="h-6 w-6" />, label: "Chat", path: "/chat" },
    { icon: <FiUpload className="h-6 w-6" />, label: "Upload POST", path: "/upload" },
    { icon: <CgProfile className="h-6 w-6" />, label: "Profile", path: "/profile" },
    { icon: <AiOutlineHome className="h-6 w-6" />, label: "Search", path: "/search" },
  ];

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden text-2xl text-white bg-black p-2 rounded-md"
        onClick={toggleMenu}
      >
        {menuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
      </button>

      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-300 p-4 z-40 transform transition-transform duration-300 ease-in-out
        ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2560px-Instagram_logo.svg.png"
            alt="Instagram"
            className="h-10 object-contain"
          />
        </div>

        {/* Navigation Items */}
        <ul className="space-y-6">
          {navItems.map((item, index) => (
            <li
              key={index}
              className={`flex items-center space-x-4 p-2 rounded-md transition-colors duration-200 cursor-pointer
              ${location.pathname === item.path ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}
              `}
            >
              {item.icon}
              <Link to={item.path} className="text-lg font-medium">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Bottom Profile Placeholder */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-300"></div>
          <div className="text-gray-600 font-medium">Username</div>
          
        </div>
        
      </nav>
    </>
  );
};

export default Navbar;
