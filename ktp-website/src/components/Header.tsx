// src/components/Header.tsx
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-100">
      {/* Left: KTP logo/text */}
      <h1 className="text-2xl font-bold text-gray-800">KTP</h1>

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
