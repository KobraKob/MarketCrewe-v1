import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

// React Icons
const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const AppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled 
          ? 'bg-[#EFE4D2]/95 backdrop-blur-lg shadow-xl border-b border-[#254D70]/10' 
          : 'bg-[#EFE4D2]/90 backdrop-blur-sm shadow-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 group"
            >
              <Link 
                to="/" 
                className="flex items-center space-x-3 transition-all duration-300"
              >
                <motion.div 
                  whileHover={{ rotate: 6 }}
                  className="w-10 h-10 bg-gradient-to-br from-[#254D70] to-[#131D4F] rounded-xl flex items-center justify-center shadow-md"
                >
                  <span className="text-white font-bold text-lg">M</span>
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#254D70] via-[#131D4F] to-[#954C2E] bg-clip-text text-transparent">
                    MarketCrew
                  </span>
                  <span className="text-xs text-[#254D70]/60 -mt-1 tracking-wide">
                    AI Content Studio
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex space-x-6">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/"
                    className={`group flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isActiveRoute('/') 
                        ? 'bg-[#254D70] text-white shadow-lg' 
                        : 'text-[#254D70] hover:bg-[#254D70]/10 hover:text-[#131D4F]'
                    }`}
                  >
                    <HomeIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    <span>Home</span>
                    {isActiveRoute('/') && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#954C2E] rounded-full"
                      ></motion.div>
                    )}
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/app"
                    className={`group flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isActiveRoute('/app') 
                        ? 'bg-[#254D70] text-white shadow-lg' 
                        : 'text-[#254D70] hover:bg-[#254D70]/10 hover:text-[#131D4F]'
                    }`}
                  >
                    <AppIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    <span>Studio</span>
                    {isActiveRoute('/app') && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#954C2E] rounded-full"
                      ></motion.div>
                    )}
                  </Link>
                </motion.div>
              </div>

              {/* CTA Button */}
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/app"
                  className="bg-gradient-to-r from-[#254D70] to-[#954C2E] text-white text-sm px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-xl flex items-center space-x-2"
                >
                  <span>Get Started</span>
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>
            </div>

            {/* Mobile menu button */}
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="md:hidden"
            >
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg text-[#254D70] hover:bg-[#254D70]/10 transition-all duration-300"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <CloseIcon className="w-6 h-6 transition-transform duration-300" />
                ) : (
                  <MenuIcon className="w-6 h-6 transition-transform duration-300" />
                )}
              </button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <motion.div 
          initial={false}
          animate={isOpen ? "open" : "closed"}
          variants={{
            open: { 
              opacity: 1,
              height: "auto",
              transition: { 
                duration: 0.3,
                ease: "easeInOut"
              }
            },
            closed: { 
              opacity: 0,
              height: 0,
              transition: { 
                duration: 0.3,
                ease: "easeInOut"
              }
            }
          }}
          className="md:hidden overflow-hidden"
        >
          <div className="px-4 pt-2 pb-6 space-y-3 bg-[#EFE4D2]/95 backdrop-blur-lg border-t border-[#254D70]/10">
            <motion.div whileHover={{ scale: 1.02 }}>
              <Link
                to="/"
                className={`group flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isActiveRoute('/') 
                    ? 'bg-[#254D70] text-white shadow-lg' 
                    : 'text-[#254D70] hover:bg-[#254D70]/10'
                }`}
              >
                <HomeIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span>Home</span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }}>
              <Link
                to="/app"
                className={`group flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isActiveRoute('/app') 
                    ? 'bg-[#254D70] text-white shadow-lg' 
                    : 'text-[#254D70] hover:bg-[#254D70]/10'
                }`}
              >
                <AppIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span>Studio</span>
              </Link>
            </motion.div>

            <div className="pt-4">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Link
                  to="/app"
                  className="bg-gradient-to-r from-[#254D70] to-[#954C2E] w-full text-center py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Get Started Free</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;