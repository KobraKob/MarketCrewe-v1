import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 text-2xl font-extrabold text-indigo-600">
            MarketCrew
          </div>
          <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <Link to="/" className="hover:text-indigo-600 transition-colors duration-200">
              Home
            </Link>
            <Link to="/app" className="hover:text-indigo-600 transition-colors duration-200">
              App
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
