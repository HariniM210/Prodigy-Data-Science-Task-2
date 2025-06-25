import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Titanic Data Explorer
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Data sourced from Kaggle's Titanic Competition
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <a 
              href="https://www.kaggle.com/c/titanic/data" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm hover:text-teal-400 transition-colors duration-200"
            >
              Dataset
            </a>
            <a 
              href="#" 
              className="text-sm hover:text-teal-400 transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-sm hover:text-teal-400 transition-colors duration-200"
            >
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;