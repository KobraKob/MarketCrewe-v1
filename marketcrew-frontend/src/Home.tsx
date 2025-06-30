import React from 'react';

interface HomeProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

const Home: React.FC<HomeProps> = ({ onLoginClick, onSignupClick }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl text-center">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 animate-pulse">
              ✨ AI Content Generator
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform your brand story into compelling marketing content with the power of AI
          </p>
        </div>

        {/* Call to Action Buttons */}
        <div className="space-x-4 mt-8">
          <button
            onClick={onSignupClick}
            className="px-8 py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Sign Up
          </button>
          <button
            onClick={onLoginClick}
            className="px-8 py-4 rounded-xl font-bold text-lg text-blue-600 bg-white border-2 border-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Login
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mb-4"></div>
        <p>© {new Date().getFullYear()} AI Content Generator. Crafted with ❤️ and AI</p>
      </footer>
    </div>
  );
};

export default Home;
