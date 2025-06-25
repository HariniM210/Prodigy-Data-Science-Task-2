import React from 'react';
import { AnchorIcon } from 'lucide-react';
import { useData } from '../context/DataContext';

const Header: React.FC = () => {
  const { fileName } = useData();

  return (
    <header className="bg-blue-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <AnchorIcon className="h-8 w-8 mr-2 text-teal-400" />
          <div>
            <h1 className="text-2xl font-bold">Titanic Data Explorer</h1>
            {fileName && (
              <p className="text-sm text-teal-200">
                Currently exploring: {fileName}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <a
            href="https://www.kaggle.com/c/titanic/data"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Get Dataset
          </a>
          <a
            href="https://github.com/your-username/titanic-explorer"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            View Code
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;