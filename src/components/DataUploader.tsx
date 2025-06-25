import React, { useCallback, useState } from 'react';
import { UploadIcon, CheckCircleIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
import Papa from 'papaparse';
import { Passenger } from '../context/DataContext';

interface DataUploaderProps {
  onSuccess: () => void;
}

const DataUploader: React.FC<DataUploaderProps> = ({ onSuccess }) => {
  const { setRawData, setCleanedData, setLoading, setFileName } = useData();
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const processFile = useCallback((file: File) => {
    setLoading(true);
    setError(null);
    
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      setLoading(false);
      return;
    }

    Papa.parse<Passenger>(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError(`Error parsing CSV: ${results.errors[0].message}`);
          setLoading(false);
          return;
        }

        // Basic validation for Titanic dataset
        const requiredColumns = ['PassengerId', 'Survived', 'Pclass', 'Name', 'Sex'];
        const missingColumns = requiredColumns.filter(
          col => !results.meta.fields?.includes(col)
        );

        if (missingColumns.length > 0) {
          setError(`Missing required columns: ${missingColumns.join(', ')}`);
          setLoading(false);
          return;
        }

        // Process the data
        setRawData(results.data);
        setCleanedData(results.data); // Initial data is same as raw
        setFileName(file.name);
        setSuccess(true);
        setLoading(false);
        
        // Wait a moment before moving to next step
        setTimeout(() => {
          onSuccess();
        }, 1500);
      },
      error: (error) => {
        setError(`Error parsing file: ${error.message}`);
        setLoading(false);
      }
    });
  }, [setRawData, setCleanedData, setLoading, setFileName, onSuccess]);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  const handleSampleData = useCallback(() => {
    setLoading(true);
    setError(null);
    
    fetch('https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch sample data');
        }
        return response.text();
      })
      .then(csvText => {
        Papa.parse<Passenger>(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            setRawData(results.data);
            setCleanedData(results.data);
            setFileName('titanic.csv (sample)');
            setSuccess(true);
            setLoading(false);
            
            setTimeout(() => {
              onSuccess();
            }, 1500);
          }
        });
      })
      .catch(err => {
        setError(`Error loading sample data: ${err.message}`);
        setLoading(false);
      });
  }, [setRawData, setCleanedData, setLoading, setFileName, onSuccess]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Upload Dataset</h2>
      
      <div 
        className={`
          border-2 border-dashed rounded-lg p-8
          flex flex-col items-center justify-center
          transition-all duration-300 ease-in-out
          ${dragActive ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:border-gray-400'}
          ${success ? 'bg-green-50 border-green-500' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {success ? (
          <div className="text-center">
            <CheckCircleIcon className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <p className="text-lg font-medium text-green-700">Upload successful!</p>
          </div>
        ) : (
          <>
            <UploadIcon className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-lg mb-2 text-center">
              Drag & drop a CSV file or click to upload
            </p>
            <p className="text-sm text-gray-500 mb-6 text-center">
              Upload the Titanic dataset (or any similar CSV file)
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".csv"
              onChange={handleChange}
            />
            <label
              htmlFor="file-upload"
              className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-md cursor-pointer transition-colors duration-200"
            >
              Select File
            </label>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-2">Don't have the Titanic dataset?</p>
              <button
                onClick={handleSampleData}
                className="text-teal-600 hover:text-teal-800 underline text-sm font-medium"
              >
                Load Sample Titanic Dataset
              </button>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-md font-medium mb-2">Dataset Information</h3>
        <p className="text-sm text-gray-600">
          The Titanic dataset contains information about the passengers aboard the RMS Titanic, which sank after colliding with an iceberg on April 15, 1912. The dataset includes passenger information such as age, gender, ticket class, and survival status.
        </p>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium">Expected columns:</h4>
          <ul className="mt-2 text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
            <li>• PassengerId: Unique identifier for each passenger</li>
            <li>• Survived: Whether the passenger survived (1) or not (0)</li>
            <li>• Pclass: Ticket class (1 = 1st, 2 = 2nd, 3 = 3rd)</li>
            <li>• Name: Passenger name</li>
            <li>• Sex: Male or female</li>
            <li>• Age: Age in years</li>
            <li>• SibSp: Number of siblings/spouses aboard</li>
            <li>• Parch: Number of parents/children aboard</li>
            <li>• Ticket: Ticket number</li>
            <li>• Fare: Passenger fare</li>
            <li>• Cabin: Cabin number</li>
            <li>• Embarked: Port of embarkation (C = Cherbourg, Q = Queenstown, S = Southampton)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DataUploader;