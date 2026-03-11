import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  X,
  Home,
  Briefcase,
  Building,
  Info,
  Mail,
  User,
} from "lucide-react";

const SideBar = ({ toggleMenu, isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarLinks = [
    {
      id: "home",
      label: "Home",
      path: "/",
      icon: <Home size={20} />,
    },
    {
      id: "jobs",
      label: "Jobs",
      path: "/jobs",
      icon: <Briefcase size={20} />,
    },
    {
      id: "companies",
      label: "Companies",
      path: "/companies",
      icon: <Building size={20} />,
    },
    {
      id: "about",
      label: "About",
      path: "/about",
      icon: <Info size={20} />,
    },
    {
      id: "contact",
      label: "Contact",
      path: "/contact",
      icon: <Mail size={20} />,
    },
  ];

  const isAuthenticated = false;

  useEffect(() => {
    if (isOpen) toggleMenu();
  }, [location.pathname]);

  const handleNavClick = (path) => {
    navigate(path);
    toggleMenu();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="#2563EB" strokeWidth="4" />
              <path d="M16 24L24 14L32 24L24 34L16 24Z" fill="#2563EB" />
            </svg>
            <h2 className="text-lg font-semibold text-[#0F172A]">ReqTrack</h2>
          </div>

          <button
            onClick={toggleMenu}
            className="p-2 hover:bg-[#F1F5F9] rounded-md"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-4">
          {sidebarLinks.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className={`flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer transition ${
                isActive(item.path)
                  ? "bg-[#2563EB] text-white"
                  : "text-[#0F172A] hover:bg-[#F1F5F9]"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="absolute bottom-0 w-full p-5 border-t border-[#E2E8F0] bg-[#F8FAFC]">

          {!isAuthenticated && (
            <>
              <button
                onClick={() => {
                  navigate("/login");
                  toggleMenu();
                }}
                className="w-full mb-3 border border-[#2563EB] text-[#2563EB] py-3 rounded-md hover:bg-[#DBEAFE] transition flex items-center justify-center gap-2"
              >
                <User size={18} />
                Login
              </button>

              <button
                onClick={() => {
                  navigate("/register");
                  toggleMenu();
                }}
                className="w-full bg-[#2563EB] text-white py-3 rounded-md hover:bg-[#1D4ED8] transition"
              >
                Register
              </button>
            </>
          )}

        </div>
      </aside>
    </>
  );
};

export default SideBar;