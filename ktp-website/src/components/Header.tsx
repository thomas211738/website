import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ktplogo from "../img/KTPLogo.jpeg";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white ${
        isScrolled ? "shadow-md" : ""
      } transition-shadow duration-300`}
    >
      {/* Outer container with horizontal flex layout */}
      <div className="max-w-7xl mx-auto flex items-center px-6 py-4">
        {/* Left: Logo (clickable, goes home) */}
        <Link to="/">
          <img src={ktplogo} alt="KTP Logo" className="h-12 mr-4" />
        </Link>

        {/* Centered Nav */}
        <nav className="flex-1">
          <ul className="flex justify-center space-x-6">
            <li>
              <Link to="/" className="text-gray-600 hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-600 hover:text-blue-600">
                About
              </Link>
            </li>
            <li>
              <Link
                to="/brothers"
                className="text-gray-600 hover:text-blue-600"
              >
                Brothers
              </Link>
            </li>
            <li>
              <Link to="/rush" className="text-gray-600 hover:text-blue-600">
                Rush
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-gray-600 hover:text-blue-600"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
