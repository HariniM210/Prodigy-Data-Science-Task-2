import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { CleaningOptions } from '../types/dataTypes';
import { ClipboardCheckIcon, AlertCircleIcon } from 'lucide-react';

interface DataCleanerProps {
  onSuccess: () => void;
}

const DataCleaner: React.FC<DataCleanerProps> = ({ onSuccess }) => {
  const { rawData, cleanData, cleanedData } = useData();
  const [options, setOptions] = useState<CleaningOptions>({
    fillMissingAges: true,
    fillMissingEmbarked: true,
    addFamilySize: true,
    extractTitle: true,
  });
  const [isProcessed, setIsProcessed] = useState(false);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setOptions((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleCleanData = () => {
    cleanData(options);
    setIsProcessed(true);
    setTimeout(() => {
      onSuccess();
    }, 1500);
  };

  // Calculate missing values stats
  const missingAges = rawData.filter(p => p.Age === null).length;
  const missingEmbarked = rawData.filter(p => !p.Embarked).length;
  const missingCabin = rawData.filter(p => !p.Cabin).length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Clean and Prepare Data</h2>
      
      <div className="mb-6">
        <h3 className="text-md font-medium mb-3">Dataset Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <p className="text-sm text-blue-800 font-medium">Total Records</p>
            <p className="text-2xl font-bold text-blue-900">{rawData.length}</p>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
            <p className="text-sm text-amber-800 font-medium">Missing Values</p>
            <div className="mt-2 text-sm">
              <div className="flex justify-between">
                <span>Age:</span>
                <span className="font-medium">{missingAges} ({((missingAges / rawData.length) * 100).toFixed(1)}%)</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Embarked:</span>
                <span className="font-medium">{missingEmbarked} ({((missingEmbarked / rawData.length) * 100).toFixed(1)}%)</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Cabin:</span>
                <span className="font-medium">{missingCabin} ({((missingCabin / rawData.length) * 100).toFixed(1)}%)</span>
              </div>
            </div>
          </div>
          
          <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
            <p className="text-sm text-teal-800 font-medium">Data Types</p>
            <div className="mt-2 text-sm">
              <div className="flex justify-between">
                <span>Numerical:</span>
                <span className="font-medium">7 columns</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Categorical:</span>
                <span className="font-medium">5 columns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-md font-medium mb-3">Data Cleaning Options</h3>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-6">
              <input
                id="fillMissingAges"
                name="fillMissingAges"
                type="checkbox"
                checked={options.fillMissingAges}
                onChange={handleOptionChange}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="fillMissingAges" className="font-medium text-gray-700">
                Fill missing age values
              </label>
              <p className="text-sm text-gray-500">
                Replace missing age values with the mean age from the dataset
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-6">
              <input
                id="fillMissingEmbarked"
                name="fillMissingEmbarked"
                type="checkbox"
                checked={options.fillMissingEmbarked}
                onChange={handleOptionChange}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="fillMissingEmbarked" className="font-medium text-gray-700">
                Fill missing embarked values
              </label>
              <p className="text-sm text-gray-500">
                Replace missing embarked values with the most common port (Southampton)
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-6">
              <input
                id="addFamilySize"
                name="addFamilySize"
                type="checkbox"
                checked={options.addFamilySize}
                onChange={handleOptionChange}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="addFamilySize" className="font-medium text-gray-700">
                Add family size feature
              </label>
              <p className="text-sm text-gray-500">
                Create a new 'FamilySize' column by combining SibSp and Parch values
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-6">
              <input
                id="extractTitle"
                name="extractTitle"
                type="checkbox"
                checked={options.extractTitle}
                onChange={handleOptionChange}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="extractTitle" className="font-medium text-gray-700">
                Extract title from name
              </label>
              <p className="text-sm text-gray-500">
                Extract and normalize titles (Mr, Mrs, Miss, etc.) from passenger names
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {isProcessed ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <ClipboardCheckIcon className="h-6 w-6 text-green-600 mr-2" />
          <div>
            <p className="font-medium text-green-800">Data cleaning completed successfully!</p>
            <p className="text-sm text-green-600">
              {cleanedData.length} records processed with your selected options.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center text-amber-700 text-sm">
            <AlertCircleIcon className="h-5 w-5 mr-2" />
            <span>Select at least one cleaning option to continue</span>
          </div>
          <button
            onClick={handleCleanData}
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
            disabled={!Object.values(options).some(Boolean)}
          >
            Clean Data
          </button>
        </div>
      )}
    </div>
  );
};

export default DataCleaner;