import React from 'react';
import { motion } from 'framer-motion';

interface HomeProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

const Home: React.FC<HomeProps> = ({ onLoginClick, onSignupClick }) => {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-5xl text-center">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <div className="mb-8">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-primary mb-6"
            >
              ✨ AI Content Generator
            </motion.h1>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '10rem' }}
              transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
              className="h-1.5 w-40 bg-gradient-to-r from-navy-primary to-rust mx-auto rounded-full mb-8"
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg md:text-xl text-navy-secondary/80 max-w-3xl mx-auto leading-relaxed"
          >
            Transform your brand story into compelling marketing content with the power of AI
          </motion.p>
        </motion.div>

        {/* Call to Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-6 mt-12"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(37, 77, 112, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onSignupClick}
            className="btn-primary px-10 py-5 text-lg md:text-xl font-semibold"
          >
            Get Started Free
          </motion.button>
          <motion.button
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(37, 77, 112, 0.1)"
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onLoginClick}
            className="px-10 py-5 rounded-xl font-semibold text-lg md:text-xl text-navy-primary bg-white border-2 border-navy-primary transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Login
          </motion.button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-16 flex flex-col items-center"
        >
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-navy-primary/30 to-transparent mb-4" />
          <p className="text-sm text-navy-secondary/60">
            Trusted by marketing teams worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-8 mt-6">
            {["BrandA", "BrandB", "BrandC", "BrandD"].map((brand, index) => (
              <motion.div
                key={brand}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                className="text-navy-primary/70 font-medium"
              >
                {brand}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="mt-20 text-center text-navy-secondary/60 text-sm"
      >
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-navy-primary/30 to-transparent mx-auto mb-4" />
        <p>© {new Date().getFullYear()} MarketCrew. Crafted with ❤️ and AI</p>
      </motion.footer>
    </div>
  );
};

export default Home;