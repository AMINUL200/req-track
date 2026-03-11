import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Menu, User } from "lucide-react";

const Navbar = ({ toggleMenu }) => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = false;

  const navLinks = [
    { id: "home", label: "Home", path: "/" },
    { id: "jobs", label: "Jobs", path: "/jobs" },
    { id: "companies", label: "Companies", path: "/companies" },
    { id: "about", label: "About", path: "/about" },
    { id: "contact", label: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#F8FAFC] shadow-[0_2px_8px_rgba(0,0,0,0.05)] py-2"
          : "bg-[#F8FAFC]/90 backdrop-blur-sm py-4"
      }`}
    >
      <div className="px-8 flex justify-between items-center max-w-[1400px] mx-auto">

        {/* Logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="24" cy="24" r="20" stroke="#2563EB" strokeWidth="4" />
            <path d="M16 24L24 14L32 24L24 34L16 24Z" fill="#2563EB" />
          </svg>

          <h1 className="ml-2 text-xl font-semibold text-[#0F172A]">
            ReqTrack
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">

          {navLinks.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className="cursor-pointer font-medium text-[#0F172A] hover:text-[#2563EB] transition"
            >
              {item.label}
            </div>
          ))}

          {/* Login */}
          {!isAuthenticated && (
            <RouterLink
              to="/login"
              className="ml-4 px-5 py-2 rounded-md border border-[#2563EB] text-[#2563EB] hover:bg-[#DBEAFE] transition flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Login
            </RouterLink>
          )}

          {/* Register */}
          {!isAuthenticated && (
            <RouterLink
              to="/register"
              className="px-5 py-2 rounded-md bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition"
            >
              Register
            </RouterLink>
          )}

        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-[#0F172A] cursor-pointer"
          >
            <Menu size={30} />
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;