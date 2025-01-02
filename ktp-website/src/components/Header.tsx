import { Link } from 'react-router-dom';
import ktplogo from '../img/KTPLogo.jpeg';
import { useState, useEffect } from 'react';

function Header() {
const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white ${
        isScrolled ? 'shadow-md' : ''
      } transition-shadow duration-300`}
    >
      {/* Left: KTP logo as an image */}
      <img
        src={ktplogo}
        alt="KTP Logo"
        className="h-12"
      />

      {/* Right: Navigation */}
      <nav className="space-x-4">
        <Link to="/" className="text-gray-600 hover:text-blue-600">
          Home
        </Link>
        <Link to="/about" className="text-gray-600 hover:text-blue-600">
          About
        </Link>
        <Link to="/brothers" className="text-gray-600 hover:text-blue-600">
          Brothers
        </Link>
        <Link to="/rush" className="text-gray-600 hover:text-blue-600">
          Rush
        </Link>
        <Link to="/contact" className="text-gray-600 hover:text-blue-600">
          Contact
        </Link>
      </nav>
    </header>
  );
}

export default Header;
